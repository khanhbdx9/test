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
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import {
  DeletedRoleResponseDto,
  RoleDetailResponseDto,
  RolePermissionsResponseDto,
  RoleResponseDto,
} from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách role' })
  @ApiStandardPaginatedResponse({ type: RoleResponseDto, description: MESSAGES.FETCH_SUCCESS })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryRoleDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id/permissions')
  @Permissions('roles.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách permission của role' })
  @ApiStandardResponse({
    type: RolePermissionsResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  listPermissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.listPermissions(id);
  }

  @Get(':id')
  @Permissions('roles.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết role' })
  @ApiStandardResponse({ type: RoleDetailResponseDto, description: MESSAGES.FETCH_SUCCESS })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('roles.create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo role' })
  @ApiStandardResponse({ type: RoleDetailResponseDto, status: 201, description: MESSAGES.CREATED })
  @ApiStandardErrorResponse()
  create(@CurrentUser() actor: AuthenticatedUser, @Body() dto: CreateRoleDto) {
    return this.rolesService.create(actor, dto);
  }

  @Patch(':id')
  @Permissions('roles.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật role' })
  @ApiStandardResponse({ type: RoleResponseDto, description: MESSAGES.UPDATE_SUCCESS })
  @ApiStandardErrorResponse()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Patch(':id/permissions')
  @Permissions('roles.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Gán permission cho role' })
  @ApiStandardResponse({
    type: RolePermissionsResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  replacePermissions(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.replacePermissions(actor, id, dto);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa role' })
  @ApiStandardResponse({ type: DeletedRoleResponseDto, description: MESSAGES.DELETE_SUCCESS })
  @ApiStandardErrorResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
