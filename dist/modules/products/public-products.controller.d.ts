import { ProductResponseDto } from './dto/product-response.dto';
import { QueryPublicProductDto, QueryRelatedProductDto } from './dto/query-public-product.dto';
import { ProductsService } from './products.service';
export declare class PublicProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findPublished(query: QueryPublicProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findRelated(categorySlug: string, productSlug: string, query: QueryRelatedProductDto): Promise<{
        items: ProductResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findPublishedBySlug(categorySlug: string, productSlug: string): Promise<ProductResponseDto>;
}
