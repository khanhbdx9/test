import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  Notification,
  NotificationType,
  Prisma,
  UserStatus,
} from '../../generated/prisma/client';
import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { BulkReadNotificationsDto } from './dto/bulk-read-notifications.dto';
import {
  BulkReadResultDto,
  NotificationResponseDto,
  UnreadCountResponseDto,
} from './dto/notification-response.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrderCreatedNotifications(
    order: OrderResponseDto,
  ): Promise<void> {
    const recipients = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
        status: UserStatus.ACTIVE,
        role: {
          permissions: {
            some: {
              permission: { code: 'orders.view' },
            },
          },
        },
      },
      select: { id: true },
    });
    if (recipients.length === 0) {
      return;
    }

    const title = `Đơn hàng mới từ ${order.phone}`;
    const message = [
      order.fullName ? `Khách: ${order.fullName}` : null,
      `SĐT: ${order.phone}`,
      `Tổng: ${order.totalAmount} VND`,
      `${order.products.length} sản phẩm`,
    ]
      .filter(Boolean)
      .join(' · ');

    await this.prisma.notification.createMany({
      data: recipients.map((user) => ({
        userId: user.id,
        type: NotificationType.ORDER_CREATED,
        title,
        message,
        link: `/orders/${order.id}`,
        metadata: {
          orderId: order.id,
          phone: order.phone,
          totalAmount: order.totalAmount,
          productIds: order.productIds,
        } as Prisma.InputJsonValue,
      })),
    });
  }

  async findAll(
    userId: string,
    query: QueryNotificationDto,
  ): Promise<{
    items: NotificationResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.NotificationWhereInput = { userId };
    if (query.isRead !== undefined) {
      where.isRead = query.isRead;
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: rows.map((row) => this.toResponse(row)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<NotificationResponseDto> {
    return this.toResponse(await this.getOwned(userId, id));
  }

  async unreadCount(userId: string): Promise<UnreadCountResponseDto> {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markRead(
    userId: string,
    id: string,
  ): Promise<NotificationResponseDto> {
    await this.getOwned(userId, id);
    const row = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
    return this.toResponse(row);
  }

  async markUnread(
    userId: string,
    id: string,
  ): Promise<NotificationResponseDto> {
    await this.getOwned(userId, id);
    const row = await this.prisma.notification.update({
      where: { id },
      data: { isRead: false, readAt: null },
    });
    return this.toResponse(row);
  }

  async bulkRead(
    userId: string,
    dto: BulkReadNotificationsDto,
  ): Promise<BulkReadResultDto> {
    if (!dto.all && (!dto.ids || dto.ids.length === 0)) {
      throw new BadRequestException(MESSAGES.VALIDATION_ERROR);
    }

    const where: Prisma.NotificationWhereInput = {
      userId,
      isRead: false,
    };
    if (!dto.all) {
      where.id = { in: dto.ids };
    }

    const result = await this.prisma.notification.updateMany({
      where,
      data: { isRead: true, readAt: new Date() },
    });
    return { updated: result.count };
  }

  private async getOwned(
    userId: string,
    id: string,
  ): Promise<Notification> {
    const row = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!row) {
      throw new NotFoundException(MESSAGES.NOTIFICATION_NOT_FOUND);
    }
    return row;
  }

  private toResponse(row: Notification): NotificationResponseDto {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      link: row.link,
      metadata: (row.metadata ?? null) as Record<string, unknown> | null,
      isRead: row.isRead,
      readAt: row.readAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
