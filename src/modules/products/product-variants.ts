import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
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

export function normalizeProductVariants(
  variants: ProductVariantInput[],
): ProductVariantWrite[] {
  const seen = new Set<string>();
  return variants.map((variant, index) => {
    const sku = variant.sku.trim();
    if (seen.has(sku)) {
      throw new BadRequestException(MESSAGES.DUPLICATE_VARIANT_SKU);
    }
    seen.add(sku);
    const price = new Prisma.Decimal(variant.price);
    const salePrice =
      variant.salePrice === undefined || variant.salePrice === null
        ? null
        : new Prisma.Decimal(variant.salePrice);
    if (salePrice && salePrice.gte(price)) {
      throw new BadRequestException(MESSAGES.INVALID_SALE_PRICE);
    }
    return {
      sku,
      size: variant.size.trim(),
      style: variant.style.trim(),
      price,
      salePrice,
      status: variant.status ?? VariantStatus.ACTIVE,
      sortOrder: variant.sortOrder ?? index,
    };
  });
}
