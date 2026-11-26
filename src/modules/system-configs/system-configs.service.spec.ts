import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { SystemConfigsService } from './system-configs.service';

describe('SystemConfigsService', () => {
  const prisma = {
    systemConfig: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const service = new SystemConfigsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('trả về value theo key', async () => {
    prisma.systemConfig.findUnique.mockResolvedValue({
      value: ' owner@example.com ',
    });
    await expect(service.findValueByKey('EMAIL_NOTIFICATION')).resolves.toBe(
      'owner@example.com',
    );
  });

  it('findByKey 404 khi thiếu key', async () => {
    prisma.systemConfig.findUnique.mockResolvedValue(null);
    await expect(service.findByKey('QR_PAYMENT')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('conflict khi key trùng', async () => {
    prisma.systemConfig.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );
    await expect(
      service.create({
        key: 'EMAIL_NOTIFICATION',
        value: 'a@b.com',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('404 khi không tìm thấy', async () => {
    prisma.systemConfig.findUnique.mockResolvedValue(null);
    await expect(
      service.findOne('11111111-1111-4111-8111-111111111111'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
