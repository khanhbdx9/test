import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { VariantStatus } from '../../../generated/prisma/client';

const MONEY = /^\d{1,10}(\.\d{1,2})?$/;

export class ProductVariantDto {
  @ApiProperty({ example: 'BK-DAU-16' })
  @IsString()
  @MinLength(1, { message: 'SKU biến thể không được để trống' })
  @MaxLength(64)
  sku!: string;

  @ApiProperty({ example: '16cm' })
  @IsString()
  @MinLength(1, { message: 'Kích thước không được để trống' })
  @MaxLength(100)
  size!: string;

  @ApiProperty({ example: 'Dâu' })
  @IsString()
  @MinLength(1, { message: 'Mẫu bánh không được để trống' })
  @MaxLength(100)
  style!: string;

  @ApiProperty({ example: '250000' })
  @Matches(MONEY, { message: 'Giá bán không hợp lệ' })
  price!: string;

  @ApiPropertyOptional({ example: '220000', nullable: true })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @Matches(MONEY, { message: 'Giá khuyến mãi không hợp lệ' })
  salePrice?: string | null;

  @ApiPropertyOptional({ enum: VariantStatus, default: VariantStatus.ACTIVE })
  @IsOptional()
  @IsEnum(VariantStatus, { message: 'Trạng thái biến thể không hợp lệ' })
  status?: VariantStatus;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  sortOrder?: number;
}
