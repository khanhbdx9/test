import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Cột bảng products được phép sort. */
export const PUBLIC_FILTER_SORT_BY = [
  'name',
  'sku',
  'slug',
  'price',
  'salePrice',
  'createdAt',
  'updatedAt',
  'isFeatured',
  'isBestSeller',
] as const;

export type PublicFilterSortBy = (typeof PUBLIC_FILTER_SORT_BY)[number];

export class PublicFilterDto {
  @ApiPropertyOptional({
    example: 'bánh kem sinh nhật',
    description: 'Từ khóa lọc (tên, sku, slug, mô tả, tên danh mục)',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 12;

  @ApiPropertyOptional({ description: 'Lọc theo danh mục (UUID)' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiPropertyOptional({ example: 100000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 500000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    enum: PUBLIC_FILTER_SORT_BY,
    default: 'createdAt',
    description: 'Cột bảng products để sắp xếp',
  })
  @IsOptional()
  @IsIn([...PUBLIC_FILTER_SORT_BY])
  sortBy?: PublicFilterSortBy = 'createdAt';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
    description: 'Tăng dần (asc) hoặc giảm dần (desc)',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc' = 'desc';
}
