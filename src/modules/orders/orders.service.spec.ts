import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  OrderStatus,
  PaymentMethod,
  Prisma,
  ProductStatus,
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
    product: {
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
        productIds: ['11111111-1111-4111-8111-111111111111'],
        phone: '0901234567',
        shippingAddress: '123 Nguyễn Huệ',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('tính tổng từ salePrice/price trong DB rồi gửi mail', async () => {
    const now = new Date();
    prisma.product.findMany.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        sku: 'CAKE-1',
        name: 'Bánh A',
        price: new Prisma.Decimal('350000'),
        salePrice: new Prisma.Decimal('299000'),
        images: [{ url: 'https://cdn.example.com/a.jpg' }],
        status: ProductStatus.PUBLISHED,
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        sku: 'CAKE-2',
        name: 'Bánh B',
        price: new Prisma.Decimal('100000'),
        salePrice: null,
        images: [],
        status: ProductStatus.PUBLISHED,
      },
    ]);
    prisma.order.create.mockResolvedValue({
      id: '33333333-3333-4333-8333-333333333333',
      email: null,
      phone: '0901234567',
      shippingAddress: '123 Nguyễn Huệ',
      fullName: null,
      note: null,
      paymentMethod: PaymentMethod.AT_STORE,
      paymentImageUrl: null,
      status: OrderStatus.PENDING_CONFIRMATION,
      deliveryDate: null,
      deliveryTime: null,
      productIds: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
      totalAmount: new Prisma.Decimal('399000'),
      createdAt: now,
      updatedAt: now,
    });

    const result = await service.createPublic({
      productIds: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
      phone: '0901234567',
      shippingAddress: '123 Nguyễn Huệ',
      paymentMethod: PaymentMethod.AT_STORE,
    });

    expect(result.totalAmount).toBe('399000.00');
    expect(result.products).toHaveLength(2);
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalAmount: new Prisma.Decimal('399000'),
        }),
      }),
    );
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
});
