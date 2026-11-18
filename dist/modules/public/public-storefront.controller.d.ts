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
import { QueryPublicPostDto, QueryRelatedPostDto } from '../posts/dto/query-post.dto';
import { PostsService } from '../posts/posts.service';
import { ProductResponseDto } from '../products/dto/product-response.dto';
import { QueryPublicProductDto, QueryRelatedProductDto } from '../products/dto/query-public-product.dto';
import { ProductsService } from '../products/products.service';
import { ThemeResponseDto } from '../themes/dto/theme-response.dto';
import { ThemesService } from '../themes/themes.service';
import { PublicFilterResponseDto } from './dto/public-filter-response.dto';
import { PublicFilterDto } from './dto/public-filter.dto';
import { PublicFilterService } from './public-filter.service';
export declare class PublicStorefrontController {
    private readonly categoriesService;
    private readonly productsService;
    private readonly ordersService;
    private readonly themesService;
    private readonly bannersService;
    private readonly postsService;
    private readonly publicFilterService;
    constructor(categoriesService: CategoriesService, productsService: ProductsService, ordersService: OrdersService, themesService: ThemesService, bannersService: BannersService, postsService: PostsService, publicFilterService: PublicFilterService);
    findCategories(query: QueryPublicCategoryDto): Promise<{
        items: CategoryResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findCategory(id: string): Promise<CategoryResponseDto>;
    findProducts(query: QueryPublicProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findRelatedProducts(categorySlug: string, productSlug: string, query: QueryRelatedProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findProduct(categorySlug: string, productSlug: string): Promise<ProductResponseDto>;
    filter(dto: PublicFilterDto): Promise<PublicFilterResponseDto>;
    createOrder(dto: CreateOrderDto): Promise<OrderResponseDto>;
    findActiveTheme(): Promise<ThemeResponseDto | null>;
    findActiveBanners(query: QueryPublicBannerDto): Promise<BannerResponseDto[]>;
    findPosts(query: QueryPublicPostDto): Promise<{
        items: PostResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findRelatedPosts(slug: string, query: QueryRelatedPostDto): Promise<{
        items: PostResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findPost(slug: string): Promise<PostResponseDto>;
}
