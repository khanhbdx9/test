import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  FulfillmentMethod,
  OrderStatus,
  PaymentMethod,
  Prisma,
  ProductStatus,
  VariantStatus,
} from '../../generated/prisma/client';

describe('OrdersService', () => {
  const prisma = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    productVariant: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const mailService = {
    notifyNewOrder: jest.fn().mockResolvedValue(undefined),
  };
  const notificationsService = {
    createOrderCreatedNotifications: jest.fn().mockResolvedValue(undefined),
  };

  const service = new OrdersService(
    prisma as never,
    mailService as never,
    notificationsService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('từ chối tạo đơn chuyển khoản thiếu ngày giao', async () => {
    await expect(
      service.createPublic({
        items: [
          {
            productId: '11111111-1111-4111-8111-111111111111',
            variantId: '22222222-2222-4222-8222-222222222222',
            quantity: 1,
          },
        ],
        fullName: 'Khách',
        phone: '0901234567',
        fulfillmentMethod: FulfillmentMethod.PICKUP,
        shippingAddress: null,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('tính tổng từ giá biến thể * quantity rồi gửi mail', async () => {
    const now = new Date();
    prisma.productVariant.findMany.mockResolvedValue([
      {
        id: '22222222-2222-4222-8222-222222222222',
        productId: '11111111-1111-4111-8111-111111111111',
        sku: 'CAKE-1-S',
        size: 'S',
        style: 'Tròn',
        price: new Prisma.Decimal('350000'),
        salePrice: new Prisma.Decimal('299000'),
        status: VariantStatus.ACTIVE,
        product: {
          id: '11111111-1111-4111-8111-111111111111',
          sku: 'CAKE-1',
          name: 'Bánh A',
          status: ProductStatus.PUBLISHED,
          images: [{ url: 'https://cdn.example.com/a.jpg' }],
        },
      },
      {
        id: '33333333-3333-4333-8333-333333333333',
        productId: '44444444-4444-4444-8444-444444444444',
        sku: 'CAKE-2-S',
        size: 'S',
        style: 'Tròn',
        price: new Prisma.Decimal('100000'),
        salePrice: null,
        status: VariantStatus.ACTIVE,
        product: {
          id: '44444444-4444-4444-8444-444444444444',
          sku: 'CAKE-2',
          name: 'Bánh B',
          status: ProductStatus.PUBLISHED,
          images: [],
        },
      },
    ]);
    prisma.order.create.mockResolvedValue({
      id: '55555555-5555-4555-8555-555555555555',
      email: null,
      phone: '0901234567',
      shippingAddress: null,
      fullName: 'Khách Mock',
      note: null,
      paymentMethod: PaymentMethod.AT_STORE,
      paymentImageUrl: null,
      fulfillmentMethod: FulfillmentMethod.PICKUP,
      status: OrderStatus.PENDING_CONFIRMATION,
      deliveryDate: null,
      deliveryTime: null,
      totalAmount: new Prisma.Decimal('698000'),
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: 'item-1',
          orderId: '55555555-5555-4555-8555-555555555555',
          productId: '11111111-1111-4111-8111-111111111111',
          variantId: '22222222-2222-4222-8222-222222222222',
          quantity: 2,
          unitPrice: new Prisma.Decimal('299000'),
          productName: 'Bánh A',
          productSku: 'CAKE-1',
          variantSku: 'CAKE-1-S',
          size: 'S',
          style: 'Tròn',
          imageUrl: 'https://cdn.example.com/a.jpg',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'item-2',
          orderId: '55555555-5555-4555-8555-555555555555',
          productId: '44444444-4444-4444-8444-444444444444',
          variantId: '33333333-3333-4333-8333-333333333333',
          quantity: 1,
          unitPrice: new Prisma.Decimal('100000'),
          productName: 'Bánh B',
          productSku: 'CAKE-2',
          variantSku: 'CAKE-2-S',
          size: 'S',
          style: 'Tròn',
          imageUrl: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    const result = await service.createPublic({
      items: [
        {
          productId: '11111111-1111-4111-8111-111111111111',
          variantId: '22222222-2222-4222-8222-222222222222',
          quantity: 2,
        },
        {
          productId: '44444444-4444-4444-8444-444444444444',
          variantId: '33333333-3333-4333-8333-333333333333',
          quantity: 1,
        },
      ],
      fullName: 'Khách Mock',
      phone: '0901234567',
      fulfillmentMethod: FulfillmentMethod.PICKUP,
      shippingAddress: null,
      paymentMethod: PaymentMethod.AT_STORE,
    });

    expect(result.totalAmount).toBe('698000.00');
    expect(result.items).toHaveLength(2);
    expect(result.items[0].lineTotal).toBe('598000.00');
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalAmount: new Prisma.Decimal('698000'),
          fulfillmentMethod: FulfillmentMethod.PICKUP,
        }),
      }),
    );
    await new Promise<void>((resolve) => setImmediate(resolve));
    expect(mailService.notifyNewOrder).toHaveBeenCalled();
  });

  it('404 khi cập nhật đơn không tồn tại', async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    await expect(
      service.updateStatus('11111111-1111-4111-8111-111111111111', {
        status: OrderStatus.CONFIRMED,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findHistory mặc định chỉ REJECTED và COMPLETED trong khoảng createdAt', async () => {
    prisma.$transaction.mockImplementation(
      async (ops: Array<Promise<unknown>>) => Promise.all(ops),
    );
    prisma.order.count.mockResolvedValue(0);
    prisma.order.findMany.mockResolvedValue([]);

    await service.findHistory({
      page: 1,
      limit: 10,
      createdFrom: '2026-11-01',
      createdTo: '2026-11-22',
    });

    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          createdAt: {
            gte: new Date('2026-11-01T00:00:00.000Z'),
            lt: new Date('2026-11-23T00:00:00.000Z'),
          },
          status: {
            in: [OrderStatus.REJECTED, OrderStatus.COMPLETED],
          },
        },
      }),
    );
  });

  it('từ chối khoảng createdFrom > createdTo', async () => {
    await expect(
      service.findAll({
        page: 1,
        limit: 10,
        createdFrom: '2026-11-22',
        createdTo: '2026-11-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
