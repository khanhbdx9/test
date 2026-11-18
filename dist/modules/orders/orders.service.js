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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
let OrdersService = class OrdersService {
    prisma;
    mailService;
    notificationsService;
    constructor(prisma, mailService, notificationsService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.notificationsService = notificationsService;
    }
    async createPublic(dto) {
        this.assertDeliveryDate(dto.paymentMethod, dto.deliveryDate);
        const productIds = this.normalizeProductIds(dto.productIds);
        const priced = await this.loadPricedProducts(productIds);
        const totalAmount = priced.reduce((sum, item) => sum.add(item.unitPrice), new client_1.Prisma.Decimal(0));
        const order = await this.prisma.order.create({
            data: {
                email: dto.email ?? null,
                phone: dto.phone,
                shippingAddress: dto.shippingAddress,
                fullName: dto.fullName ?? null,
                note: dto.note ?? null,
                paymentMethod: dto.paymentMethod,
                paymentImageUrl: dto.paymentImageUrl ?? null,
                status: client_1.OrderStatus.PENDING_CONFIRMATION,
                deliveryDate: this.toDateOnly(dto.deliveryDate),
                deliveryTime: dto.deliveryTime ?? null,
                productIds,
                totalAmount,
            },
        });
        const response = this.toResponse(order, priced);
        await Promise.all([
            this.mailService.notifyNewOrder(response),
            this.notificationsService.createOrderCreatedNotifications(response),
        ]);
        return response;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {};
        if (query.deliveryDate) {
            where.deliveryDate = this.toDateOnly(query.deliveryDate);
        }
        if (query.deliveryTime) {
            where.deliveryTime = query.deliveryTime;
        }
        if (query.status && query.status.length > 0) {
            where.status = { in: query.status };
        }
        if (query.search) {
            where.OR = [
                { phone: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const sortCreated = query.sortCreated ?? 'desc';
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: sortCreated },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        const productsById = await this.loadProductsMap(rows.flatMap((row) => row.productIds));
        return {
            items: rows.map((row) => this.toResponse(row, row.productIds
                .map((id) => productsById.get(id))
                .filter((item) => Boolean(item)))),
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findOne(id) {
        const order = await this.getOrder(id);
        const productsById = await this.loadProductsMap(order.productIds);
        const priced = order.productIds
            .map((productId) => productsById.get(productId))
            .filter((item) => Boolean(item));
        return this.toResponse(order, priced);
    }
    async updateStatus(id, dto) {
        const current = await this.getOrder(id);
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
        });
        const productsById = await this.loadProductsMap(current.productIds);
        const priced = current.productIds
            .map((productId) => productsById.get(productId))
            .filter((item) => Boolean(item));
        return this.toResponse(order, priced);
    }
    async getOrder(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.NOT_FOUND);
        }
        return order;
    }
    normalizeProductIds(productIds) {
        const unique = [...new Set(productIds.map((id) => id.trim()))];
        if (unique.length === 0) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.PRODUCTS_REQUIRED);
        }
        return unique;
    }
    async loadPricedProducts(productIds) {
        const productsById = await this.loadProductsMap(productIds, true);
        const missing = productIds.filter((id) => !productsById.has(id));
        if (missing.length > 0) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.PRODUCT_NOT_FOUND);
        }
        return productIds.map((id) => productsById.get(id));
    }
    async loadProductsMap(productIds, requirePublished = false) {
        const uniqueIds = [...new Set(productIds)];
        if (uniqueIds.length === 0) {
            return new Map();
        }
        const where = {
            id: { in: uniqueIds },
            deletedAt: null,
        };
        if (requirePublished) {
            where.status = client_1.ProductStatus.PUBLISHED;
        }
        const rows = await this.prisma.product.findMany({
            where,
            select: {
                id: true,
                sku: true,
                name: true,
                price: true,
                salePrice: true,
                images: {
                    where: { isCover: true },
                    select: { url: true },
                    take: 1,
                },
            },
        });
        return new Map(rows.map((row) => [
            row.id,
            {
                id: row.id,
                sku: row.sku,
                name: row.name,
                unitPrice: row.salePrice ?? row.price,
                imageUrl: row.images[0]?.url ?? null,
            },
        ]));
    }
    assertDeliveryDate(paymentMethod, deliveryDate) {
        if (paymentMethod === client_1.PaymentMethod.BANK_TRANSFER && !deliveryDate) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.DELIVERY_DATE_REQUIRED);
        }
    }
    toDateOnly(value) {
        if (!value) {
            return null;
        }
        return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    }
    formatDateOnly(value) {
        if (!value) {
            return null;
        }
        return value.toISOString().slice(0, 10);
    }
    toProductItems(products) {
        return products.map((product) => ({
            id: product.id,
            sku: product.sku,
            name: product.name,
            unitPrice: product.unitPrice.toFixed(2),
            imageUrl: product.imageUrl,
        }));
    }
    toResponse(order, products) {
        return {
            id: order.id,
            email: order.email,
            phone: order.phone,
            shippingAddress: order.shippingAddress,
            fullName: order.fullName,
            note: order.note,
            paymentMethod: order.paymentMethod,
            paymentImageUrl: order.paymentImageUrl,
            status: order.status,
            deliveryDate: this.formatDateOnly(order.deliveryDate),
            deliveryTime: order.deliveryTime,
            productIds: order.productIds,
            totalAmount: order.totalAmount.toFixed(2),
            products: this.toProductItems(products),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map