import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { ThemesService } from './themes.service';

describe('ThemesService', () => {
  const prisma: {
    theme: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  } = {
    theme: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation(
    async (fn: (tx: typeof prisma) => Promise<unknown>) => fn(prisma),
  );
  const service = new ThemesService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('kích hoạt theme mới thì tắt theme cũ', async () => {
    prisma.theme.create.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Classic',
      code: 'classic',
      description: null,
      config: { primaryColor: '#8b3a2b' },
      previewUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await service.create({
      name: 'Classic',
      code: 'classic',
      config: { primaryColor: '#8b3a2b' },
      isActive: true,
    });

    expect(prisma.theme.updateMany).toHaveBeenCalledWith({
      where: { isActive: true },
      data: { isActive: false },
    });
  });

  it('conflict khi code trùng', async () => {
    prisma.theme.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );
    await expect(
      service.create({
        name: 'Classic',
        code: 'classic',
        config: {},
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('404 khi không tìm thấy', async () => {
    prisma.theme.findUnique.mockResolvedValue(null);
    await expect(
      service.findOne('11111111-1111-4111-8111-111111111111'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
