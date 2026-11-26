import { BadRequestException } from '@nestjs/common';
import { OrderStatus, Prisma } from '../../generated/prisma/client';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  const prisma = {
    order: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn(),
    },
  };
  const service = new ReportsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('từ chối from > to', async () => {
    await expect(
      service.getDashboard({
        from: '2026-11-30',
        to: '2026-11-01',
        topLimit: 10,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('tổng hợp doanh thu COMPLETED và top sản phẩm', async () => {
    prisma.order.groupBy.mockResolvedValue([
      { status: OrderStatus.COMPLETED, _count: { _all: 2 } },
      { status: OrderStatus.PENDING_CONFIRMATION, _count: { _all: 1 } },
    ]);
    prisma.order.findMany.mockResolvedValue([
      {
        id: 'o1',
        totalAmount: new Prisma.Decimal('300000'),
        createdAt: new Date('2026-11-10T08:00:00.000Z'),
      },
      {
        id: 'o2',
        totalAmount: new Prisma.Decimal('200000'),
        createdAt: new Date('2026-11-11T08:00:00.000Z'),
      },
    ]);
    prisma.orderItem.findMany.mockResolvedValue([
      {
        productId: 'p1',
        productName: 'Bánh A',
        productSku: 'A',
        quantity: 2,
        unitPrice: new Prisma.Decimal('100000'),
      },
      {
        productId: 'p2',
        productName: 'Bánh B',
        productSku: 'B',
        quantity: 1,
        unitPrice: new Prisma.Decimal('200000'),
      },
    ]);

    const result = await service.getDashboard({
      from: '2026-11-01',
      to: '2026-11-30',
      topLimit: 10,
    });

    expect(result.summary.totalRevenue).toBe('500000.00');
    expect(result.summary.totalOrders).toBe(3);
    expect(result.summary.completedOrders).toBe(2);
    expect(result.topProducts[0].productId).toBe('p1');
    expect(result.topProducts[0].revenue).toBe('200000.00');
    expect(result.revenueByDay).toHaveLength(2);
  });
});
