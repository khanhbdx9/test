import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardErrorResponse,
  ApiStandardPaginatedResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { ProductResponseDto } from './dto/product-response.dto';
import {
  QueryPublicProductDto,
  QueryRelatedProductDto,
} from './dto/query-public-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Public()
@Controller('public/products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary: 'Danh sách sản phẩm đã xuất bản, ưu tiên nổi bật rồi mới tạo',
  })
  @ApiStandardPaginatedResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findPublished(@Query() query: QueryPublicProductDto) {
    return this.productsService.findPublished(query);
  }

  @Get(':categorySlug/:productSlug/related')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Sản phẩm liên quan cùng danh mục' })
  @ApiStandardPaginatedResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findRelated(
    @Param('categorySlug') categorySlug: string,
    @Param('productSlug') productSlug: string,
    @Query() query: QueryRelatedProductDto,
  ) {
    return this.productsService.findRelated(categorySlug, productSlug, query);
  }

  @Get(':categorySlug/:productSlug')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết sản phẩm theo danh mục và slug' })
  @ApiStandardResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findPublishedBySlug(
    @Param('categorySlug') categorySlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    return this.productsService.findPublishedBySlug(categorySlug, productSlug);
  }
}
