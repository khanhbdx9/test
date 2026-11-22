import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Query chung cho danh sách đơn CMS: page/limit + khoảng createdAt bắt buộc. */
export class QueryOrderListBaseDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page tối thiểu là 1' })
  page!: number;

  @ApiProperty({ example: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit tối thiểu là 1' })
  @Max(100, { message: 'limit tối đa là 100' })
  limit!: number;

  @ApiProperty({
    example: '2026-11-01',
    description: 'Lọc createdAt từ ngày (YYYY-MM-DD), bắt buộc',
  })
  @IsDateString({}, { message: 'Ngày bắt đầu (createdFrom) không hợp lệ' })
  createdFrom!: string;

  @ApiProperty({
    example: '2026-11-22',
    description: 'Lọc createdAt đến ngày (YYYY-MM-DD), bắt buộc',
  })
  @IsDateString({}, { message: 'Ngày kết thúc (createdTo) không hợp lệ' })
  createdTo!: string;

  @ApiPropertyOptional({ example: '2026-11-20' })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày giao hàng không hợp lệ' })
  deliveryDate?: string;

  @ApiPropertyOptional({ example: '09:00-11:00' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deliveryTime?: string;

  @ApiPropertyOptional({
    description: 'Tìm theo số điện thoại hoặc email',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
