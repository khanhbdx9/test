import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
export declare class QueryPublicProductDto extends PaginationQueryDto {
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
}
export declare class QueryPublicCategoryProductDto extends PaginationQueryDto {
    search?: string;
}
export declare class QueryRelatedProductDto extends PaginationQueryDto {
}
