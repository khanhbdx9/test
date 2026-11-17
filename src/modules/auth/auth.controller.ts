import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardErrorResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { AuthenticatedUser } from './authenticated-user';
import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  LogoutResponseDto,
  MeResponseDto,
  TokenResponseDto,
} from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(MESSAGES.LOGIN_SUCCESS)
  @ApiOperation({ summary: 'Đăng nhập bằng email và mật khẩu' })
  @ApiStandardResponse({ type: LoginResponseDto, description: MESSAGES.LOGIN_SUCCESS })
  @ApiStandardErrorResponse()
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới access token' })
  @ApiStandardResponse({ type: TokenResponseDto })
  @ApiStandardErrorResponse()
  refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ResponseMessage(MESSAGES.LOGOUT_SUCCESS)
  @ApiOperation({ summary: 'Đăng xuất phiên hiện tại' })
  @ApiStandardResponse({ type: LogoutResponseDto, description: MESSAGES.LOGOUT_SUCCESS })
  @ApiStandardErrorResponse()
  logout(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() dto: RefreshTokenDto,
  ): Promise<LogoutResponseDto> {
    return this.authService.logout(actor, dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  @ApiStandardResponse({ type: MeResponseDto, description: MESSAGES.FETCH_SUCCESS })
  @ApiStandardErrorResponse()
  me(@CurrentUser() actor: AuthenticatedUser): MeResponseDto {
    return this.authService.me(actor);
  }
}
