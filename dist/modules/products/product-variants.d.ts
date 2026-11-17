import { Prisma, VariantStatus } from '../../generated/prisma/client';
export interface ProductVariantInput {
    sku: string;
    size: string;
    style: string;
    price: string;
    salePrice?: string | null;
    status?: VariantStatus;
    sortOrder?: number;
}
export interface ProductVariantWrite {
    sku: string;
    size: string;
    style: string;
    price: Prisma.Decimal;
    salePrice: Prisma.Decimal | null;
    status: VariantStatus;
    sortOrder: number;
}
export declare function normalizeProductVariants(variants: ProductVariantInput[]): ProductVariantWrite[];
