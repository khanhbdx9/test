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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(query) {
        this.assertDateRange(query.from, query.to);
        const from = this.toDateOnly(query.from);
        const toExclusive = this.toExclusiveEndDate(query.to);
        const topLimit = query.topLimit ?? 10;
        const rangeWhere = {
            createdAt: { gte: from, lt: toExclusive },
        };
        const completedWhere = {
            ...rangeWhere,
            status: client_1.OrderStatus.COMPLETED,
        };
        const [statusGroups, completedOrders] = await Promise.all([
            this.prisma.order.groupBy({
                by: ['status'],
                where: rangeWhere,
                _count: { _all: true },
            }),
            this.prisma.order.findMany({
                where: completedWhere,
                select: {
                    id: true,
                    totalAmount: true,
                    createdAt: true,
                },
            }),
        ]);
        const totalOrders = statusGroups.reduce((sum, row) => sum + row._count._all, 0);
        const completedCount = completedOrders.length;
        let totalRevenue = new client_1.Prisma.Decimal(0);
        const byDay = new Map();
        const byMonth = new Map();
        for (const order of completedOrders) {
            totalRevenue = totalRevenue.add(order.totalAmount);
            const day = order.createdAt.toISOString().slice(0, 10);
            const month = day.slice(0, 7);
            const dayBucket = byDay.get(day) ?? {
                revenue: new client_1.Prisma.Decimal(0),
                orders: 0,
            };
            dayBucket.revenue = dayBucket.revenue.add(order.totalAmount);
            dayBucket.orders += 1;
            byDay.set(day, dayBucket);
            const monthBucket = byMonth.get(month) ?? {
                revenue: new client_1.Prisma.Decimal(0),
                orders: 0,
            };
            monthBucket.revenue = monthBucket.revenue.add(order.totalAmount);
            monthBucket.orders += 1;
            byMonth.set(month, monthBucket);
        }
        const averageOrderValue = completedCount === 0
            ? new client_1.Prisma.Decimal(0)
            : totalRevenue.div(completedCount);
        const completedIds = completedOrders.map((order) => order.id);
        const lineItems = completedIds.length === 0
            ? []
            : await this.prisma.orderItem.findMany({
                where: { orderId: { in: completedIds } },
                select: {
                    productId: true,
                    productName: true,
                    productSku: true,
                    quantity: true,
                    unitPrice: true,
                },
            });
        const productAgg = new Map();
        for (const item of lineItems) {
            const current = productAgg.get(item.productId) ?? {
                productId: item.productId,
                productName: item.productName,
                productSku: item.productSku,
                quantity: 0,
                revenue: new client_1.Prisma.Decimal(0),
            };
            current.quantity += item.quantity;
            current.revenue = current.revenue.add(item.unitPrice.mul(item.quantity));
            productAgg.set(item.productId, current);
        }
        const topProducts = [...productAgg.values()]
            .sort((a, b) => b.quantity - a.quantity || b.revenue.comparedTo(a.revenue))
            .slice(0, topLimit)
            .map((row) => ({
            productId: row.productId,
            productName: row.productName,
            productSku: row.productSku,
            quantity: row.quantity,
            revenue: row.revenue.toFixed(2),
        }));
        return {
            summary: {
                totalRevenue: totalRevenue.toFixed(2),
                totalOrders,
                completedOrders: completedCount,
                averageOrderValue: averageOrderValue.toFixed(2),
            },
            ordersByStatus: statusGroups
                .map((row) => ({
                status: row.status,
                count: row._count._all,
            }))
                .sort((a, b) => a.status.localeCompare(b.status)),
            revenueByDay: [...byDay.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, bucket]) => ({
                date,
                revenue: bucket.revenue.toFixed(2),
                orders: bucket.orders,
            })),
            revenueByMonth: [...byMonth.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, bucket]) => ({
                month,
                revenue: bucket.revenue.toFixed(2),
                orders: bucket.orders,
            })),
            topProducts,
        };
    }
    assertDateRange(from, to) {
        if (from.slice(0, 10) > to.slice(0, 10)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_CREATED_DATE_RANGE);
        }
    }
    toDateOnly(value) {
        return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    }
    toExclusiveEndDate(value) {
        const end = this.toDateOnly(value);
        end.setUTCDate(end.getUTCDate() + 1);
        return end;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map