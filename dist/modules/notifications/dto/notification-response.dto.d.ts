import { NotificationType } from '../../../generated/prisma/client';
export declare class NotificationResponseDto {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    link: string | null;
    metadata: Record<string, unknown> | null;
    isRead: boolean;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UnreadCountResponseDto {
    count: number;
}
export declare class BulkReadResultDto {
    updated: number;
}
