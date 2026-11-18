import { AuthenticatedUser } from '../auth/authenticated-user';
import { BulkReadNotificationsDto } from './dto/bulk-read-notifications.dto';
import { BulkReadResultDto, NotificationResponseDto, UnreadCountResponseDto } from './dto/notification-response.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: AuthenticatedUser, query: QueryNotificationDto): Promise<{
        items: NotificationResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    unreadCount(user: AuthenticatedUser): Promise<UnreadCountResponseDto>;
    findOne(user: AuthenticatedUser, id: string): Promise<NotificationResponseDto>;
    markRead(user: AuthenticatedUser, id: string): Promise<NotificationResponseDto>;
    markUnread(user: AuthenticatedUser, id: string): Promise<NotificationResponseDto>;
    bulkRead(user: AuthenticatedUser, dto: BulkReadNotificationsDto): Promise<BulkReadResultDto>;
}
