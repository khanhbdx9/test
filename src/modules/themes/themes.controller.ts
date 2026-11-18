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
import { AnyPermissions, Permissions } from '../../common/decorators/permissions.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreateThemeDto } from './dto/create-theme.dto';
import { QueryThemeDto } from './dto/query-theme.dto';
import {
  DeletedThemeResponseDto,
  ThemeResponseDto,
} from './dto/theme-response.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemesService } from './themes.service';

@ApiTags('Themes')
@ApiBearerAuth()
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @AnyPermissions('themes.view', 'themes.manage')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách theme' })
  @ApiStandardPaginatedResponse({
    type: ThemeResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryThemeDto) {
    return this.themesService.findAll(query);
  }

  @Get(':id')
  @AnyPermissions('themes.view', 'themes.manage')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết theme' })
  @ApiStandardResponse({
    type: ThemeResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.themesService.findOne(id);
  }

  @Post()
  @Permissions('themes.manage')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo theme' })
  @ApiStandardResponse({
    type: ThemeResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  create(@Body() dto: CreateThemeDto) {
    return this.themesService.create(dto);
  }

  @Patch(':id')
  @Permissions('themes.manage')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật theme' })
  @ApiStandardResponse({
    type: ThemeResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThemeDto,
  ) {
    return this.themesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('themes.manage')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa theme' })
  @ApiStandardResponse({
    type: DeletedThemeResponseDto,
    description: MESSAGES.DELETE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.themesService.remove(id);
  }
}
