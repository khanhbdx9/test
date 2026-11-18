import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  Prisma,
  ProductStatus,
} from '../../generated/prisma/client';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderProductItemDto,
  OrderResponseDto,
} from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type PricedProduct = {
  id: string;
  sku: string;
  name: string;
  unitPrice: Prisma.Decimal;
  imageUrl: string | null;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createPublic(dto: CreateOrderDto): Promise<OrderResponseDto> {
    this.assertDeliveryDate(dto.paymentMethod, dto.deliveryDate);
    const productIds = this.normalizeProductIds(dto.productIds);
    const priced = await this.loadPricedProducts(productIds);
    const totalAmount = priced.reduce(
      (sum, item) => sum.add(item.unitPrice),
      new Prisma.Decimal(0),
    );

    const order = await this.prisma.order.create({
      data: {
        email: dto.email ?? null,
        phone: dto.phone,
        shippingAddress: dto.shippingAddress,
        fullName: dto.fullName ?? null,
        note: dto.note ?? null,
        paymentMethod: dto.paymentMethod,
        paymentImageUrl: dto.paymentImageUrl ?? null,
        status: OrderStatus.PENDING_CONFIRMATION,
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

  async findAll(query: QueryOrderDto): Promise<{
    items: OrderResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.OrderWhereInput = {};

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

    const productsById = await this.loadProductsMap(
      rows.flatMap((row) => row.productIds),
    );

    return {
      items: rows.map((row) =>
        this.toResponse(
          row,
          row.productIds
            .map((id) => productsById.get(id))
            .filter((item): item is PricedProduct => Boolean(item)),
        ),
      ),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.getOrder(id);
    const productsById = await this.loadProductsMap(order.productIds);
    const priced = order.productIds
      .map((productId) => productsById.get(productId))
      .filter((item): item is PricedProduct => Boolean(item));
    return this.toResponse(order, priced);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const current = await this.getOrder(id);
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
    const productsById = await this.loadProductsMap(current.productIds);
    const priced = current.productIds
      .map((productId) => productsById.get(productId))
      .filter((item): item is PricedProduct => Boolean(item));
    return this.toResponse(order, priced);
  }

  private async getOrder(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(MESSAGES.NOT_FOUND);
    }
    return order;
  }

  private normalizeProductIds(productIds: string[]): string[] {
    const unique = [...new Set(productIds.map((id) => id.trim()))];
    if (unique.length === 0) {
      throw new BadRequestException(MESSAGES.PRODUCTS_REQUIRED);
    }
    return unique;
  }

  private async loadPricedProducts(
    productIds: string[],
  ): Promise<PricedProduct[]> {
    const productsById = await this.loadProductsMap(productIds, true);
    const missing = productIds.filter((id) => !productsById.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(MESSAGES.PRODUCT_NOT_FOUND);
    }
    return productIds.map((id) => productsById.get(id)!);
  }

  private async loadProductsMap(
    productIds: string[],
    requirePublished = false,
  ): Promise<Map<string, PricedProduct>> {
    const uniqueIds = [...new Set(productIds)];
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const where: Prisma.ProductWhereInput = {
      id: { in: uniqueIds },
      deletedAt: null,
    };
    if (requirePublished) {
      where.status = ProductStatus.PUBLISHED;
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

    return new Map(
      rows.map((row) => [
        row.id,
        {
          id: row.id,
          sku: row.sku,
          name: row.name,
          unitPrice: row.salePrice ?? row.price,
          imageUrl: row.images[0]?.url ?? null,
        },
      ]),
    );
  }

  private assertDeliveryDate(
    paymentMethod: PaymentMethod,
    deliveryDate?: string,
  ): void {
    if (paymentMethod === PaymentMethod.BANK_TRANSFER && !deliveryDate) {
      throw new BadRequestException(MESSAGES.DELIVERY_DATE_REQUIRED);
    }
  }

  private toDateOnly(value?: string | null): Date | null {
    if (!value) {
      return null;
    }
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  }

  private formatDateOnly(value: Date | null): string | null {
    if (!value) {
      return null;
    }
    return value.toISOString().slice(0, 10);
  }

  private toProductItems(products: PricedProduct[]): OrderProductItemDto[] {
    return products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      unitPrice: product.unitPrice.toFixed(2),
      imageUrl: product.imageUrl,
    }));
  }

  private toResponse(
    order: Order,
    products: PricedProduct[],
  ): OrderResponseDto {
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
}
