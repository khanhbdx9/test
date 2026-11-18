export declare const PUBLIC_FILTER_SORT_BY: readonly ["name", "sku", "slug", "price", "salePrice", "createdAt", "updatedAt", "isFeatured", "isBestSeller"];
export type PublicFilterSortBy = (typeof PUBLIC_FILTER_SORT_BY)[number];
export declare class PublicFilterDto {
    search?: string;
    page?: number;
    limit?: number;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: PublicFilterSortBy;
    sort?: 'asc' | 'desc';
}
