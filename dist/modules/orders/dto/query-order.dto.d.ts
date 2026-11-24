import { OrderStatus } from '../../../generated/prisma/client';
import { QueryOrderListBaseDto } from './query-order-list.base.dto';
export declare class QueryOrderDto extends QueryOrderListBaseDto {
    status?: OrderStatus[];
}
