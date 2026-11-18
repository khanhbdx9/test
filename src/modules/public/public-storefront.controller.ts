import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MESSAGES } from '../../common/constants/messages';
import {
  ApiStandardArrayResponse,
  ApiStandardErrorResponse,
  ApiStandardPaginatedResponse,
  ApiStandardResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { BannersService } from '../banners/banners.service';
import { BannerResponseDto } from '../banners/dto/banner-response.dto';
import { QueryPublicBannerDto } from '../banners/dto/query-banner.dto';
import { CategoriesService } from '../categories/categories.service';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { QueryPublicCategoryDto } from '../categories/dto/query-public-category.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { OrdersService } from '../orders/orders.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import {
  QueryPublicPostDto,
  QueryRelatedPostDto,
} from '../posts/dto/query-post.dto';
import { PostsService } from '../posts/posts.service';
import { ProductResponseDto } from '../products/dto/product-response.dto';
import {
  QueryPublicProductDto,
  QueryRelatedProductDto,
} from '../products/dto/query-public-product.dto';
import { ProductsService } from '../products/products.service';
import { ThemeResponseDto } from '../themes/dto/theme-response.dto';
import { ThemesService } from '../themes/themes.service';
import { PublicFilterResponseDto } from './dto/public-filter-response.dto';
import { PublicFilterDto } from './dto/public-filter.dto';
import { PublicFilterService } from './public-filter.service';

@ApiTags('Public')
@Public()
@Controller('public')
export class PublicStorefrontController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly themesService: ThemesService,
    private readonly bannersService: BannersService,
    private readonly postsService: PostsService,
    private readonly publicFilterService: PublicFilterService,
  ) {}

  @Get('categories')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách danh mục đang hiển thị' })
  @ApiStandardPaginatedResponse({
    type: CategoryResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findCategories(@Query() query: QueryPublicCategoryDto) {
    return this.categoriesService.findVisible(query);
  }

  @Get('categories/:id')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết danh mục đang hiển thị' })
  @ApiStandardResponse({
    type: CategoryResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findVisibleOne(id);
  }

  @Get('products')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary: 'Danh sách sản phẩm đã xuất bản, ưu tiên nổi bật rồi mới tạo',
  })
  @ApiStandardPaginatedResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findProducts(@Query() query: QueryPublicProductDto) {
    return this.productsService.findPublished(query);
  }

  @Get('products/:categorySlug/:productSlug/related')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Sản phẩm liên quan cùng danh mục' })
  @ApiStandardPaginatedResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findRelatedProducts(
    @Param('categorySlug') categorySlug: string,
    @Param('productSlug') productSlug: string,
    @Query() query: QueryRelatedProductDto,
  ) {
    return this.productsService.findRelated(categorySlug, productSlug, query);
  }

  @Get('products/:categorySlug/:productSlug')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết sản phẩm theo danh mục và slug' })
  @ApiStandardResponse({
    type: ProductResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findProduct(
    @Param('categorySlug') categorySlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    return this.productsService.findPublishedBySlug(categorySlug, productSlug);
  }

  @Post('filter')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary:
      'Lọc storefront (sản phẩm phân trang; search, categoryId, giá, sort theo cột)',
  })
  @ApiStandardResponse({
    type: PublicFilterResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  filter(@Body() dto: PublicFilterDto) {
    return this.publicFilterService.filter(dto);
  }

  @Post('orders/create')
  @ResponseMessage(MESSAGES.CREATED)
  @ApiOperation({ summary: 'Khách tạo đơn hàng' })
  @ApiStandardResponse({
    type: OrderResponseDto,
    status: 201,
    description: MESSAGES.CREATED,
  })
  @ApiStandardErrorResponse()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createPublic(dto);
  }

  @Get('theme')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Theme đang active trên hệ thống' })
  @ApiStandardResponse({
    type: ThemeResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findActiveTheme() {
    return this.themesService.findActive();
  }

  @Get('banners')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Danh sách banner đang hoạt động' })
  @ApiStandardArrayResponse({
    type: BannerResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findActiveBanners(@Query() query: QueryPublicBannerDto) {
    return this.bannersService.findActive(query);
  }

  @Get('posts')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary:
      'Danh sách bài viết đã xuất bản (search tên, sortCreated, landing)',
  })
  @ApiStandardPaginatedResponse({
    type: PostResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findPosts(@Query() query: QueryPublicPostDto) {
    return this.postsService.findPublished(query);
  }

  @Get('posts/:slug/related')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({
    summary: 'Bài viết liên quan (theo từ khóa tiêu đề, fallback bài mới)',
  })
  @ApiStandardPaginatedResponse({
    type: PostResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findRelatedPosts(
    @Param('slug') slug: string,
    @Query() query: QueryRelatedPostDto,
  ) {
    return this.postsService.findRelated(slug, query);
  }

  @Get('posts/:slug')
  @ResponseMessage(MESSAGES.FETCH_SUCCESS)
  @ApiOperation({ summary: 'Chi tiết bài viết đã xuất bản theo slug' })
  @ApiStandardResponse({
    type: PostResponseDto,
    description: MESSAGES.FETCH_SUCCESS,
  })
  @ApiStandardErrorResponse()
  findPost(@Param('slug') slug: string) {
    return this.postsService.findPublishedBySlug(slug);
  }
}
