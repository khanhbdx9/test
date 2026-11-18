"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrderCreatedNotifications(order) {
        const recipients = await this.prisma.user.findMany({
            where: {
                deletedAt: null,
                status: client_1.UserStatus.ACTIVE,
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
                type: client_1.NotificationType.ORDER_CREATED,
                title,
                message,
                link: `/orders/${order.id}`,
                metadata: {
                    orderId: order.id,
                    phone: order.phone,
                    totalAmount: order.totalAmount,
                    productIds: order.productIds,
                },
            })),
        });
    }
    async findAll(userId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = { userId };
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
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findOne(userId, id) {
        return this.toResponse(await this.getOwned(userId, id));
    }
    async unreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });
        return { count };
    }
    async markRead(userId, id) {
        await this.getOwned(userId, id);
        const row = await this.prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
        return this.toResponse(row);
    }
    async markUnread(userId, id) {
        await this.getOwned(userId, id);
        const row = await this.prisma.notification.update({
            where: { id },
            data: { isRead: false, readAt: null },
        });
        return this.toResponse(row);
    }
    async bulkRead(userId, dto) {
        if (!dto.all && (!dto.ids || dto.ids.length === 0)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.VALIDATION_ERROR);
        }
        const where = {
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
    async getOwned(userId, id) {
        const row = await this.prisma.notification.findFirst({
            where: { id, userId },
        });
        if (!row) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.NOTIFICATION_NOT_FOUND);
        }
        return row;
    }
    toResponse(row) {
        return {
            id: row.id,
            type: row.type,
            title: row.title,
            message: row.message,
            link: row.link,
            metadata: (row.metadata ?? null),
            isRead: row.isRead,
            readAt: row.readAt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map