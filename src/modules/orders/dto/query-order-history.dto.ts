import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../generated/prisma/client';
import { QueryOrderListBaseDto } from './query-order-list.base.dto';

export const ORDER_HISTORY_STATUSES = [
  OrderStatus.REJECTED,
  OrderStatus.COMPLETED,
] as const;

export type OrderHistoryStatus = (typeof ORDER_HISTORY_STATUSES)[number];

export class QueryOrderHistoryDto extends QueryOrderListBaseDto {
  @ApiPropertyOptional({
    enum: ORDER_HISTORY_STATUSES,
    isArray: true,
    description:
      'Chỉ REJECTED hoặc COMPLETED. Bỏ trống = cả hai. Ví dụ status=COMPLETED',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsOptional()
  @IsArray()
  @IsIn([...ORDER_HISTORY_STATUSES], {
    each: true,
    message: 'Trạng thái lịch sử chỉ nhận REJECTED hoặc COMPLETED',
  })
  status?: OrderHistoryStatus[];
}
