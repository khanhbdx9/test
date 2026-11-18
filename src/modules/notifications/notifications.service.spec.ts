import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  const prisma = {
    user: { findMany: jest.fn() },
    notification: {
      createMany: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const service = new NotificationsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tạo thông báo đơn mới cho user có orders.view', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 'u1' }, { id: 'u2' }]);
    prisma.notification.createMany.mockResolvedValue({ count: 2 });

    await service.createOrderCreatedNotifications({
      id: 'o1',
      phone: '0901234567',
      fullName: 'An',
      totalAmount: '150000.00',
      productIds: ['p1'],
      products: [{ id: 'p1' }],
    } as never);

    expect(prisma.notification.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            userId: 'u1',
            type: 'ORDER_CREATED',
            link: '/orders/o1',
          }),
        ]),
      }),
    );
  });

  it('bulk-read yêu cầu all hoặc ids', async () => {
    await expect(service.bulkRead('u1', {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('404 khi thông báo không thuộc user', async () => {
    prisma.notification.findFirst.mockResolvedValue(null);
    await expect(
      service.findOne('u1', '11111111-1111-4111-8111-111111111111'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('đánh dấu đã đọc hàng loạt theo ids', async () => {
    prisma.notification.updateMany.mockResolvedValue({ count: 2 });
    await expect(
      service.bulkRead('u1', {
        ids: [
          '11111111-1111-4111-8111-111111111111',
          '22222222-2222-4222-8222-222222222222',
        ],
      }),
    ).resolves.toEqual({ updated: 2 });
  });
});
