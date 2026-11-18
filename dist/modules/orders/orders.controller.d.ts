import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(query: QueryOrderDto): Promise<{
        items: OrderResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<OrderResponseDto>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
}
