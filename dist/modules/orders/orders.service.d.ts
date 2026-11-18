import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    private readonly mailService;
    private readonly notificationsService;
    constructor(prisma: PrismaService, mailService: MailService, notificationsService: NotificationsService);
    createPublic(dto: CreateOrderDto): Promise<OrderResponseDto>;
    findAll(query: QueryOrderDto): Promise<{
        items: OrderResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<OrderResponseDto>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderResponseDto>;
    private getOrder;
    private normalizeProductIds;
    private loadPricedProducts;
    private loadProductsMap;
    private assertDeliveryDate;
    private toDateOnly;
    private formatDateOnly;
    private toProductItems;
    private toResponse;
}
