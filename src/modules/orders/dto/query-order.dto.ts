import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OrderStatus } from '../../../generated/prisma/client';

export class QueryOrderDto extends PaginationQueryDto {
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

  @ApiPropertyOptional({
    enum: OrderStatus,
    isArray: true,
    description: 'Lọc nhiều trạng thái, ví dụ status=CONFIRMED&status=COMPLETED',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsOptional()
  @IsArray()
  @IsEnum(OrderStatus, { each: true, message: 'Trạng thái không hợp lệ' })
  status?: OrderStatus[];

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
    description: 'Sort theo createdAt',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Type(() => String)
  sortCreated?: 'asc' | 'desc' = 'desc';
}
