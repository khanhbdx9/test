import { ProductStatus } from '../../../generated/prisma/client';
import { ProductImageDto } from './product-image.dto';
import { ProductVariantDto } from './product-variant.dto';
export declare class CreateProductDto {
    categoryId: string;
    sku: string;
    name: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    price: string;
    salePrice?: string | null;
    status?: ProductStatus;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    images?: ProductImageDto[];
    variants?: ProductVariantDto[];
}
