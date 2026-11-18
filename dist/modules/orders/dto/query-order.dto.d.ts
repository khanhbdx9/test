import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OrderStatus } from '../../../generated/prisma/client';
export declare class QueryOrderDto extends PaginationQueryDto {
    deliveryDate?: string;
    deliveryTime?: string;
    search?: string;
    status?: OrderStatus[];
    sortCreated?: 'asc' | 'desc';
}
