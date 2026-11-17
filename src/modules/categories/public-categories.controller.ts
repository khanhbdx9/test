import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardErrorResponse,
  ApiStandardPaginatedResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryPublicCategoryDto } from './dto/query-public-category.dto';

@ApiTags('Categories')
@Public()
@Controller('public/categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách danh mục đang hiển thị' })
  @ApiStandardPaginatedResponse({
    type: CategoryResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findVisible(@Query() query: QueryPublicCategoryDto) {
    return this.categoriesService.findVisible(query);
  }

  @Get(':id')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết danh mục đang hiển thị' })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findVisibleOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findVisibleOne(id);
  }
}
