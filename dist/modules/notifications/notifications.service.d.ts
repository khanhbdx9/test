import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { BulkReadNotificationsDto } from './dto/bulk-read-notifications.dto';
import { BulkReadResultDto, NotificationResponseDto, UnreadCountResponseDto } from './dto/notification-response.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createOrderCreatedNotifications(order: OrderResponseDto): Promise<void>;
    findAll(userId: string, query: QueryNotificationDto): Promise<{
        items: NotificationResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(userId: string, id: string): Promise<NotificationResponseDto>;
    unreadCount(userId: string): Promise<UnreadCountResponseDto>;
    markRead(userId: string, id: string): Promise<NotificationResponseDto>;
    markUnread(userId: string, id: string): Promise<NotificationResponseDto>;
    bulkRead(userId: string, dto: BulkReadNotificationsDto): Promise<BulkReadResultDto>;
    private getOwned;
    private toResponse;
}
