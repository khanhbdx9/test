import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardErrorResponse,
  ApiStandardPaginatedResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeletedUserResponseDto, UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách người dùng' })
  @ApiStandardPaginatedResponse({ type: UserResponseDto, description: MESSAGES.FETCH_SUCCESS })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Permissions('users.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết người dùng' })
  @ApiStandardResponse({ type: UserResponseDto, description: MESSAGES.FETCH_SUCCESS })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions('users.create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo tài khoản' })
  @ApiStandardResponse({ type: UserResponseDto, status: 201, description: MESSAGES.CREATED })
  @ApiStandardErrorResponse()
  create(@CurrentUser() actor: AuthenticatedUser, @Body() dto: CreateUserDto) {
    return this.usersService.create(actor, dto);
  }

  @Patch(':id')
  @Permissions('users.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật tài khoản' })
  @ApiStandardResponse({ type: UserResponseDto, description: MESSAGES.UPDATE_SUCCESS })
  @ApiStandardErrorResponse()
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(actor, id, dto);
  }

  @Patch(':id/lock')
  @Permissions('users.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Khóa tài khoản' })
  @ApiStandardResponse({ type: UserResponseDto, description: MESSAGES.UPDATE_SUCCESS })
  @ApiStandardErrorResponse()
  lock(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.lock(actor, id);
  }

  @Patch(':id/unlock')
  @Permissions('users.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Mở khóa tài khoản' })
  @ApiStandardResponse({ type: UserResponseDto, description: MESSAGES.UPDATE_SUCCESS })
  @ApiStandardErrorResponse()
  unlock(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.unlock(actor, id);
  }

  @Patch(':id/role')
  @Permissions('users.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Gán role cho người dùng' })
  @ApiStandardResponse({ type: UserResponseDto, description: MESSAGES.UPDATE_SUCCESS })
  @ApiStandardErrorResponse()
  assignRole(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRoleDto,
  ) {
    return this.usersService.assignRole(actor, id, dto);
  }

  @Delete(':id')
  @Permissions('users.delete')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa mềm tài khoản' })
  @ApiStandardResponse({ type: DeletedUserResponseDto, description: MESSAGES.DELETE_SUCCESS })
  @ApiStandardErrorResponse()
  remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.remove(actor, id);
  }
}
