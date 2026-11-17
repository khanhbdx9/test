import { AuthenticatedUser } from './authenticated-user';
import { AuthService } from './auth.service';
import { LoginResponseDto, LogoutResponseDto, MeResponseDto, TokenResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<LoginResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<TokenResponseDto>;
    logout(actor: AuthenticatedUser, dto: RefreshTokenDto): Promise<LogoutResponseDto>;
    me(actor: AuthenticatedUser): MeResponseDto;
}
