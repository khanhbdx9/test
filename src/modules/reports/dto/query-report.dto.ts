import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryReportDto {
  @ApiProperty({
    example: '2026-11-01',
    description: 'Từ ngày (YYYY-MM-DD), lọc theo createdAt',
  })
  @IsDateString({}, { message: 'Ngày bắt đầu (from) không hợp lệ' })
  from!: string;

  @ApiProperty({
    example: '2026-11-30',
    description: 'Đến ngày (YYYY-MM-DD), lọc theo createdAt',
  })
  @IsDateString({}, { message: 'Ngày kết thúc (to) không hợp lệ' })
  to!: string;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    maximum: 50,
    description: 'Số sản phẩm bán chạy tối đa',
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'topLimit phải là số nguyên' })
  @Min(1)
  @Max(50)
  topLimit?: number = 10;
}
