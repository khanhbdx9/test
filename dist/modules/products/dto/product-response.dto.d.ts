import { ProductStatus, VariantStatus } from '../../../generated/prisma/client';
export declare class ProductImageResponseDto {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    isCover: boolean;
}
export declare class ProductVariantResponseDto {
    id: string;
    sku: string;
    size: string;
    style: string;
    price: string;
    salePrice: string | null;
    status: VariantStatus;
    sortOrder: number;
}
export declare class ProductResponseDto {
    id: string;
    categoryId: string;
    categorySlug: string;
    categoryName: string;
    sku: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    price: string;
    salePrice: string | null;
    status: ProductStatus;
    isFeatured: boolean;
    isBestSeller: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    images: ProductImageResponseDto[];
    variants: ProductVariantResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeletedProductResponseDto {
    id: string;
}
