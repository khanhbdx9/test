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
import { CategoriesService } from './categories.service';
import {
  CategoryResponseDto,
  DeletedCategoryResponseDto,
} from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Permissions('categories.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách danh mục' })
  @ApiStandardPaginatedResponse({
    type: CategoryResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @Permissions('categories.view')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết danh mục' })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Permissions('categories.create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Tạo danh mục' })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @Permissions('categories.update')
  @ResponseMessage(MESSAGES.UPDATE_SUCCESS)
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    description: MESSAGES.UPDATE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('categories.delete')
  @ResponseMessage(MESSAGES.DELETE_SUCCESS)
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiStandardResponse({
    type: DeletedCategoryResponseDto,
    description: MESSAGES.DELETE_SUCCESS,
  })
  @ApiStandardErrorResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
