import { NotFoundException } from '@nestjs/common';
import { CategoryStatus, ProductStatus } from '../../generated/prisma/client';
import { ProductsService } from './products.service';

describe('ProductsService public helpers', () => {
  const prisma = {
    category: {
      findFirst: jest.fn(),
    },
    product: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const uploadsService = {
    removeFolder: jest.fn(),
    removeUnusedImageUrls: jest.fn(),
  };

  const service = new ProductsService(prisma as never, uploadsService as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findPublishedByCategory 404 khi categorySlug không visible', async () => {
    prisma.category.findFirst.mockResolvedValue(null);
    await expect(
      service.findPublishedByCategory('banh-kem', {
        page: 1,
        limit: 10,
        search: 'kem',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findRelatedOtherCategories lấy tối đa 10, mỗi category khác ít nhất 1 nếu có', async () => {
    prisma.category.findFirst.mockResolvedValue({ id: 'cat-current' });

    const makeProduct = (id: string, categoryId: string, slug: string) => ({
      id,
      categoryId,
      sku: id,
      name: id,
      slug,
      shortDescription: null,
      description: null,
      price: { toFixed: () => '100000.00' },
      salePrice: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
      isBestSeller: false,
      seoTitle: null,
      seoDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: categoryId,
        slug: `cat-${categoryId}`,
        name: categoryId,
      },
      images: [],
      variants: [],
    });

    prisma.product.findMany.mockResolvedValue([
      makeProduct('p1', 'cat-a', 'a1'),
      makeProduct('p2', 'cat-a', 'a2'),
      makeProduct('p3', 'cat-b', 'b1'),
      makeProduct('p4', 'cat-c', 'c1'),
    ]);

    const result = await service.findRelatedOtherCategories('banh-kem');

    expect(prisma.category.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          slug: 'banh-kem',
          status: CategoryStatus.VISIBLE,
        }),
      }),
    );
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: ProductStatus.PUBLISHED,
          category: expect.objectContaining({
            slug: { not: 'banh-kem' },
            status: CategoryStatus.VISIBLE,
          }),
        }),
      }),
    );
    expect(result.items.map((item) => item.id)).toEqual([
      'p1',
      'p3',
      'p4',
      'p2',
    ]);
    expect(result.pagination.limit).toBe(10);
  });
});
