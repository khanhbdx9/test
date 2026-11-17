import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { CategoryStatus } from '../../../generated/prisma/client';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bánh kem' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1, { message: 'Tên danh mục không được để trống' })
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'banh-kem' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug chỉ gồm chữ thường, số và dấu gạch ngang',
  })
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'https://cdn.example.com/categories/banh-kem.jpg',
  })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_protocol: true }, { message: 'Ảnh phải là URL hợp lệ' })
  @MaxLength(2048)
  imageUrl?: string | null;

  @ApiPropertyOptional({ enum: CategoryStatus, default: CategoryStatus.VISIBLE })
  @IsOptional()
  @IsEnum(CategoryStatus, { message: 'Trạng thái không hợp lệ' })
  status?: CategoryStatus;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @ApiPropertyOptional({ nullable: true })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUUID('4', { message: 'Danh mục cha không hợp lệ' })
  parentId?: string | null;
}
