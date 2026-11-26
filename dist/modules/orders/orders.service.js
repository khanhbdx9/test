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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
const query_order_history_dto_1 = require("./dto/query-order-history.dto");
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    mailService;
    notificationsService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, mailService, notificationsService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.notificationsService = notificationsService;
    }
    async createPublic(dto) {
        this.assertDeliveryDate(dto.paymentMethod, dto.deliveryDate);
        this.assertShippingAddress(dto.fulfillmentMethod, dto.shippingAddress);
        const resolvedItems = await this.resolveOrderItems(dto.items);
        const totalAmount = resolvedItems.reduce((sum, item) => sum.add(item.unitPrice.mul(item.quantity)), new client_1.Prisma.Decimal(0));
        const order = await this.prisma.order.create({
            data: {
                email: dto.email ?? null,
                phone: dto.phone,
                shippingAddress: dto.fulfillmentMethod === client_1.FulfillmentMethod.PICKUP
                    ? null
                    : (dto.shippingAddress ?? null),
                fullName: dto.fullName,
                note: dto.note ?? null,
                paymentMethod: dto.paymentMethod,
                paymentImageUrl: dto.paymentImageUrl ?? null,
                fulfillmentMethod: dto.fulfillmentMethod,
                status: client_1.OrderStatus.PENDING_CONFIRMATION,
                deliveryDate: this.toDateOnly(dto.deliveryDate),
                deliveryTime: dto.deliveryTime ?? null,
                totalAmount,
                items: {
                    create: resolvedItems.map((item) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        productName: item.productName,
                        productSku: item.productSku,
                        variantSku: item.variantSku,
                        size: item.size,
                        style: item.style,
                        imageUrl: item.imageUrl,
                    })),
                },
            },
            include: { items: { orderBy: { createdAt: 'asc' } } },
        });
        const response = this.toResponse(order);
        this.enqueueOrderSideEffects(response);
        return response;
    }
    enqueueOrderSideEffects(order) {
        setImmediate(() => {
            void this.runOrderSideEffects(order);
        });
    }
    async runOrderSideEffects(order) {
        try {
            await this.mailService.notifyNewOrder(order);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Side-effect mail đơn ${order.id} lỗi: ${message}`);
        }
        try {
            await this.notificationsService.createOrderCreatedNotifications(order);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Side-effect notification đơn ${order.id} lỗi: ${message}`);
        }
    }
    async findAll(query) {
        return this.queryOrders(query);
    }
    async findHistory(query) {
        const status = query.status && query.status.length > 0
            ? query.status
            : [...query_order_history_dto_1.ORDER_HISTORY_STATUSES];
        return this.queryOrders({
            page: query.page,
            limit: query.limit,
            createdFrom: query.createdFrom,
            createdTo: query.createdTo,
            deliveryDate: query.deliveryDate,
            deliveryTime: query.deliveryTime,
            search: query.search,
            status,
        });
    }
    async queryOrders(query) {
        this.assertCreatedDateRange(query.createdFrom, query.createdTo);
        const page = query.page;
        const limit = query.limit;
        const where = {
            createdAt: {
                gte: this.toDateOnly(query.createdFrom),
                lt: this.toExclusiveEndDate(query.createdTo),
            },
        };
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
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                include: { items: { orderBy: { createdAt: 'asc' } } },
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
    async findOne(id) {
        return this.toResponse(await this.getOrder(id));
    }
    async updateStatus(id, dto) {
        await this.getOrder(id);
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
            include: { items: { orderBy: { createdAt: 'asc' } } },
        });
        return this.toResponse(order);
    }
    async getOrder(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: { orderBy: { createdAt: 'asc' } } },
        });
        if (!order) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.NOT_FOUND);
        }
        return order;
    }
    async resolveOrderItems(items) {
        if (items.length === 0) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.PRODUCTS_REQUIRED);
        }
        const variantIds = [...new Set(items.map((item) => item.variantId))];
        const variants = await this.prisma.productVariant.findMany({
            where: {
                id: { in: variantIds },
                status: client_1.VariantStatus.ACTIVE,
                product: {
                    deletedAt: null,
                    status: client_1.ProductStatus.PUBLISHED,
                },
            },
            select: {
                id: true,
                productId: true,
                sku: true,
                size: true,
                style: true,
                price: true,
                salePrice: true,
                product: {
                    select: {
                        id: true,
                        sku: true,
                        name: true,
                        images: {
                            where: { isCover: true },
                            select: { url: true },
                            take: 1,
                        },
                    },
                },
            },
        });
        const variantById = new Map(variants.map((row) => [row.id, row]));
        const missing = variantIds.filter((id) => !variantById.has(id));
        if (missing.length > 0) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.VARIANT_NOT_FOUND);
        }
        return items.map((item) => {
            const variant = variantById.get(item.variantId);
            if (variant.productId !== item.productId) {
                throw new common_1.BadRequestException(messages_1.MESSAGES.VARIANT_PRODUCT_MISMATCH);
            }
            return {
                productId: variant.product.id,
                variantId: variant.id,
                quantity: item.quantity,
                unitPrice: variant.salePrice ?? variant.price,
                productName: variant.product.name,
                productSku: variant.product.sku,
                variantSku: variant.sku,
                size: variant.size,
                style: variant.style,
                imageUrl: variant.product.images[0]?.url ?? null,
            };
        });
    }
    assertDeliveryDate(paymentMethod, deliveryDate) {
        if (paymentMethod === client_1.PaymentMethod.BANK_TRANSFER && !deliveryDate) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.DELIVERY_DATE_REQUIRED);
        }
    }
    assertShippingAddress(fulfillmentMethod, shippingAddress) {
        if (fulfillmentMethod === client_1.FulfillmentMethod.DELIVERY &&
            (!shippingAddress || shippingAddress.trim().length === 0)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.SHIPPING_ADDRESS_REQUIRED);
        }
    }
    assertCreatedDateRange(createdFrom, createdTo) {
        if (createdFrom.slice(0, 10) > createdTo.slice(0, 10)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_CREATED_DATE_RANGE);
        }
    }
    toDateOnly(value) {
        if (!value) {
            return null;
        }
        return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    }
    toExclusiveEndDate(value) {
        const end = this.toDateOnly(value);
        end.setUTCDate(end.getUTCDate() + 1);
        return end;
    }
    formatDateOnly(value) {
        if (!value) {
            return null;
        }
        return value.toISOString().slice(0, 10);
    }
    toItemResponses(items) {
        return items.map((item) => {
            const unitPrice = item.unitPrice.toFixed(2);
            const lineTotal = item.unitPrice.mul(item.quantity).toFixed(2);
            return {
                id: item.id,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice,
                lineTotal,
                productName: item.productName,
                productSku: item.productSku,
                variantSku: item.variantSku,
                size: item.size,
                style: item.style,
                imageUrl: item.imageUrl,
            };
        });
    }
    toResponse(order) {
        return {
            id: order.id,
            email: order.email,
            phone: order.phone,
            shippingAddress: order.shippingAddress,
            fullName: order.fullName,
            note: order.note,
            paymentMethod: order.paymentMethod,
            paymentImageUrl: order.paymentImageUrl,
            fulfillmentMethod: order.fulfillmentMethod,
            status: order.status,
            deliveryDate: this.formatDateOnly(order.deliveryDate),
            deliveryTime: order.deliveryTime,
            totalAmount: order.totalAmount.toFixed(2),
            items: this.toItemResponses(order.items),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map