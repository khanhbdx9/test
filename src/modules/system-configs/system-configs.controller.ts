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
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { QuerySystemConfigDto } from './dto/query-system-config.dto';
import {
  DeletedSystemConfigResponseDto,
  SystemConfigResponseDto,
} from './dto/system-config-response.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { SystemConfigsService } from './system-configs.service';

@ApiTags('System configs')
@ApiBearerAuth()
@Controller('system-configs')
export class SystemConfigsController {
  constructor(private readonly systemConfigsService: SystemConfigsService) {}

  @Get()
  @Permissions('system-configs.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách cấu hình hệ thống' })
  @ApiStandardPaginatedResponse({
    type: SystemConfigResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QuerySystemConfigDto) {
    return this.systemConfigsService.findAll(query);
  }

  @Get(':id')
  @Permissions('system-configs.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết cấu hình' })
  @ApiStandardResponse({
    type: SystemConfigResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.systemConfigsService.findOne(id);
  }

  @Post()
  @Permissions('system-configs.create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo cấu hình' })
  @ApiStandardResponse({
    type: SystemConfigResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  create(@Body() dto: CreateSystemConfigDto) {
    return this.systemConfigsService.create(dto);
  }

  @Patch(':id')
  @Permissions('system-configs.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật cấu hình' })
  @ApiStandardResponse({
    type: SystemConfigResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSystemConfigDto,
  ) {
    return this.systemConfigsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('system-configs.delete')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa cấu hình' })
  @ApiStandardResponse({
    type: DeletedSystemConfigResponseDto,
    description: MESSAGES.DELETE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.systemConfigsService.remove(id);
  }
}
