import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../generated/prisma/client';
import { QueryOrderListBaseDto } from './query-order-list.base.dto';

export class QueryOrderDto extends QueryOrderListBaseDto {
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
}
