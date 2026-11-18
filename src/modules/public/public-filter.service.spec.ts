import { BadRequestException } from '@nestjs/common';
import { PublicFilterService } from './public-filter.service';

describe('PublicFilterService', () => {
  const prisma = {
    category: { findFirst: jest.fn(), findMany: jest.fn() },
    product: { count: jest.fn(), findMany: jest.fn() },
    post: { findMany: jest.fn() },
  };
  const service = new PublicFilterService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.category.findFirst.mockResolvedValue(null);
    prisma.category.findMany.mockResolvedValue([]);
    prisma.product.count.mockResolvedValue(0);
    prisma.product.findMany.mockResolvedValue([]);
    prisma.post.findMany.mockResolvedValue([]);
  });

  it('minPrice > maxPrice báo lỗi', async () => {
    await expect(
      service.filter({ minPrice: 500, maxPrice: 100 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lọc theo search + sort theo cột bảng', async () => {
    prisma.product.count.mockResolvedValue(1);
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'p1',
        categoryId: 'c1',
        sku: 'SKU-1',
        name: 'Bánh kem',
        slug: 'banh-kem',
        shortDescription: null,
        description: null,
        price: { toFixed: () => '200000.00' },
        salePrice: null,
        status: 'PUBLISHED',
        isFeatured: true,
        isBestSeller: false,
        seoTitle: null,
        seoDescription: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: { id: 'c1', slug: 'banh', name: 'Bánh' },
        images: [],
        variants: [],
      },
    ]);

    const result = await service.filter({
      search: 'kem',
      page: 1,
      limit: 12,
      sortBy: 'price',
      sort: 'asc',
    });

    expect(result.search).toBe('kem');
    expect(result.products).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'PUBLISHED',
        }),
        orderBy: [{ price: 'asc' }],
        skip: 0,
        take: 12,
      }),
    );
  });
});
