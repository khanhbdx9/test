import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardArrayResponse,
  ApiStandardErrorResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { PermissionResponseDto } from '../roles/dto/role-response.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('roles.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách permission' })
  @ApiStandardArrayResponse({
    type: PermissionResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(): Promise<PermissionResponseDto[]> {
    return this.permissionsService.findAll();
  }
}
