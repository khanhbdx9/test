import { VariantStatus } from '../../../generated/prisma/client';
export declare class ProductVariantDto {
    sku: string;
    size: string;
    style: string;
    price: string;
    salePrice?: string | null;
    status?: VariantStatus;
    sortOrder?: number;
}
