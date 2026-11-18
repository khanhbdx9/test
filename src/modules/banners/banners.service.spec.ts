import { NotFoundException } from '@nestjs/common';
import { BannersService } from './banners.service';

describe('BannersService', () => {
  const prisma = {
    banner: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const service = new BannersService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lọc banner active theo thời gian hiện tại', async () => {
    prisma.banner.findMany.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Home',
        desktopImageUrl: 'https://cdn.example.com/d.jpg',
        mobileImageUrl: null,
        link: null,
        position: 'home_hero',
        sortOrder: 0,
        startsAt: null,
        endsAt: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const items = await service.findActive({ position: 'home_hero' });
    expect(items).toHaveLength(1);
    expect(prisma.banner.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isActive: true,
          position: 'home_hero',
        }),
      }),
    );
  });

  it('404 khi không tìm thấy', async () => {
    prisma.banner.findUnique.mockResolvedValue(null);
    await expect(
      service.findOne('11111111-1111-4111-8111-111111111111'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
