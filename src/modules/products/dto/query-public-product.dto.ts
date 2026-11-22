import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryPublicProductDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: 'Danh mục không hợp lệ' })
  categoryId?: string;

  @ApiPropertyOptional({ example: 'banh-kem' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  categorySlug?: string;

  @ApiPropertyOptional()
  @Transform(({ value }: { value: unknown }) => parseBoolean(value))
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }: { value: unknown }) => parseBoolean(value))
  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;
}

export class QueryPublicCategoryProductDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Tìm theo tên, SKU hoặc slug' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}

export class QueryRelatedProductDto extends PaginationQueryDto {}

function parseBoolean(value: unknown): unknown {
  if (value === 'true' || value === true) {
    return true;
  }
  if (value === 'false' || value === false) {
    return false;
  }
  return value;
}
