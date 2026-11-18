export declare enum PublicSearchSort {
    RELEVANCE = "relevance",
    NEWEST = "newest",
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    FEATURED = "featured"
}
export declare class PublicSearchDto {
    q: string;
    page?: number;
    limit?: number;
    categoryId?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: PublicSearchSort;
}
