import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrderHistoryDto } from './dto/query-order-history.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    private readonly mailService;
    private readonly notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService, notificationsService: NotificationsService);
    createPublic(dto: CreateOrderDto): Promise<OrderResponseDto>;
    private enqueueOrderSideEffects;
    private runOrderSideEffects;
    findAll(query: QueryOrderDto): Promise<{
        items: OrderResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findHistory(query: QueryOrderHistoryDto): Promise<{
        items: OrderResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    private queryOrders;
    findOne(id: string): Promise<OrderResponseDto>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
    private getOrder;
    private resolveOrderItems;
    private assertDeliveryDate;
    private assertShippingAddress;
    private assertCreatedDateRange;
    private toDateOnly;
    private toExclusiveEndDate;
    private formatDateOnly;
    private toItemResponses;
    private toResponse;
}
