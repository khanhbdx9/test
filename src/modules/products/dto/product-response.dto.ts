import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus, VariantStatus } from '../../../generated/prisma/client';

export class ProductImageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiPropertyOptional({ nullable: true })
  alt!: string | null;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  isCover!: boolean;
}

export class ProductVariantResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sku!: string;

  @ApiProperty()
  size!: string;

  @ApiProperty()
  style!: string;

  @ApiProperty({ example: '250000.00' })
  price!: string;

  @ApiPropertyOptional({ nullable: true, example: '220000.00' })
  salePrice!: string | null;

  @ApiProperty({ enum: VariantStatus })
  status!: VariantStatus;

  @ApiProperty()
  sortOrder!: number;
}

export class ProductResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  categorySlug!: string;

  @ApiProperty()
  categoryName!: string;

  @ApiProperty()
  sku!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  shortDescription!: string | null;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty({ example: '250000.00' })
  price!: string;

  @ApiPropertyOptional({ nullable: true, example: '220000.00' })
  salePrice!: string | null;

  @ApiProperty({ enum: ProductStatus })
  status!: ProductStatus;

  @ApiProperty()
  isFeatured!: boolean;

  @ApiProperty()
  isBestSeller!: boolean;

  @ApiPropertyOptional({ nullable: true })
  seoTitle!: string | null;

  @ApiPropertyOptional({ nullable: true })
  seoDescription!: string | null;

  @ApiProperty({ type: [ProductImageResponseDto] })
  images!: ProductImageResponseDto[];

  @ApiProperty({ type: [ProductVariantResponseDto] })
  variants!: ProductVariantResponseDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeletedProductResponseDto {
  @ApiProperty()
  id!: string;
}
