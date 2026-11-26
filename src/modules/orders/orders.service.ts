import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  FulfillmentMethod,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Prisma,
  ProductStatus,
  VariantStatus,
} from '../../generated/prisma/client';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import {
  OrderItemResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import {
  ORDER_HISTORY_STATUSES,
  QueryOrderHistoryDto,
} from './dto/query-order-history.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type OrderWithItems = Order & { items: OrderItem[] };

type ResolvedOrderItem = {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  productName: string;
  productSku: string;
  variantSku: string;
  size: string;
  style: string;
  imageUrl: string | null;
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createPublic(dto: CreateOrderDto): Promise<OrderResponseDto> {
    this.assertDeliveryDate(dto.paymentMethod, dto.deliveryDate);
    this.assertShippingAddress(dto.fulfillmentMethod, dto.shippingAddress);
    const resolvedItems = await this.resolveOrderItems(dto.items);
    const totalAmount = resolvedItems.reduce(
      (sum, item) => sum.add(item.unitPrice.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    const order = await this.prisma.order.create({
      data: {
        email: dto.email ?? null,
        phone: dto.phone,
        shippingAddress:
          dto.fulfillmentMethod === FulfillmentMethod.PICKUP
            ? null
            : (dto.shippingAddress ?? null),
        fullName: dto.fullName,
        note: dto.note ?? null,
        paymentMethod: dto.paymentMethod,
        paymentImageUrl: dto.paymentImageUrl ?? null,
        fulfillmentMethod: dto.fulfillmentMethod,
        status: OrderStatus.PENDING_CONFIRMATION,
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
    // Tách hẳn khỏi request lifecycle — tránh proxy/serverless chờ SMTP → 502.
    this.enqueueOrderSideEffects(response);
    return response;
  }

  private enqueueOrderSideEffects(order: OrderResponseDto): void {
    setImmediate(() => {
      void this.runOrderSideEffects(order);
    });
  }

  private async runOrderSideEffects(order: OrderResponseDto): Promise<void> {
    try {
      await this.mailService.notifyNewOrder(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Side-effect mail đơn ${order.id} lỗi: ${message}`);
    }
    try {
      await this.notificationsService.createOrderCreatedNotifications(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Side-effect notification đơn ${order.id} lỗi: ${message}`,
      );
    }
  }

  async findAll(query: QueryOrderDto): Promise<{
    items: OrderResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    return this.queryOrders(query);
  }

  async findHistory(query: QueryOrderHistoryDto): Promise<{
    items: OrderResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const status =
      query.status && query.status.length > 0
        ? query.status
        : [...ORDER_HISTORY_STATUSES];
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

  private async queryOrders(query: QueryOrderDto): Promise<{
    items: OrderResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    this.assertCreatedDateRange(query.createdFrom, query.createdTo);
    const page = query.page;
    const limit = query.limit;
    const where: Prisma.OrderWhereInput = {
      createdAt: {
        gte: this.toDateOnly(query.createdFrom)!,
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
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    return this.toResponse(await this.getOrder(id));
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    await this.getOrder(id);
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: { orderBy: { createdAt: 'asc' } } },
    });
    return this.toResponse(order);
  }

  private async getOrder(id: string): Promise<OrderWithItems> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { orderBy: { createdAt: 'asc' } } },
    });
    if (!order) {
      throw new NotFoundException(MESSAGES.NOT_FOUND);
    }
    return order;
  }

  private async resolveOrderItems(
    items: CreateOrderItemDto[],
  ): Promise<ResolvedOrderItem[]> {
    if (items.length === 0) {
      throw new BadRequestException(MESSAGES.PRODUCTS_REQUIRED);
    }

    const variantIds = [...new Set(items.map((item) => item.variantId))];
    const variants = await this.prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        status: VariantStatus.ACTIVE,
        product: {
          deletedAt: null,
          status: ProductStatus.PUBLISHED,
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
      throw new BadRequestException(MESSAGES.VARIANT_NOT_FOUND);
    }

    return items.map((item) => {
      const variant = variantById.get(item.variantId)!;
      if (variant.productId !== item.productId) {
        throw new BadRequestException(MESSAGES.VARIANT_PRODUCT_MISMATCH);
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

  private assertDeliveryDate(
    paymentMethod: PaymentMethod,
    deliveryDate?: string,
  ): void {
    if (paymentMethod === PaymentMethod.BANK_TRANSFER && !deliveryDate) {
      throw new BadRequestException(MESSAGES.DELIVERY_DATE_REQUIRED);
    }
  }

  private assertShippingAddress(
    fulfillmentMethod: FulfillmentMethod,
    shippingAddress?: string | null,
  ): void {
    if (
      fulfillmentMethod === FulfillmentMethod.DELIVERY &&
      (!shippingAddress || shippingAddress.trim().length === 0)
    ) {
      throw new BadRequestException(MESSAGES.SHIPPING_ADDRESS_REQUIRED);
    }
  }

  private assertCreatedDateRange(createdFrom: string, createdTo: string): void {
    if (createdFrom.slice(0, 10) > createdTo.slice(0, 10)) {
      throw new BadRequestException(MESSAGES.INVALID_CREATED_DATE_RANGE);
    }
  }

  private toDateOnly(value?: string | null): Date | null {
    if (!value) {
      return null;
    }
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  }

  private toExclusiveEndDate(value: string): Date {
    const end = this.toDateOnly(value)!;
    end.setUTCDate(end.getUTCDate() + 1);
    return end;
  }

  private formatDateOnly(value: Date | null): string | null {
    if (!value) {
      return null;
    }
    return value.toISOString().slice(0, 10);
  }

  private toItemResponses(items: OrderItem[]): OrderItemResponseDto[] {
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

  private toResponse(order: OrderWithItems): OrderResponseDto {
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
}
