import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  const prisma = {
    post: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const service = new PostsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tạo bài viết HTML và slugify title', async () => {
    prisma.post.create.mockResolvedValue({
      id: 'p1',
      title: 'Cách chọn bánh',
      slug: 'cach-chon-banh',
      thumbnailUrl: null,
      content: '<p>Nội dung</p>',
      excerpt: null,
      status: 'DRAFT',
      showOnLanding: true,
      publishedAt: null,
      seoTitle: null,
      seoDescription: null,
      author: { id: 'a1', fullName: 'Admin' },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create('a1', {
      title: 'Cách chọn bánh',
      content: '<p>Nội dung</p>',
      showOnLanding: true,
    });

    expect(result.slug).toBe('cach-chon-banh');
    expect(result.showOnLanding).toBe(true);
    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          authorId: 'a1',
          content: '<p>Nội dung</p>',
          status: 'DRAFT',
          showOnLanding: true,
        }),
      }),
    );
  });

  it('public filter landing + tên + sort created_at', async () => {
    prisma.post.count.mockResolvedValue(0);
    prisma.post.findMany.mockResolvedValue([]);
    prisma.$transaction.mockImplementation(async (ops: unknown[]) =>
      Promise.all(ops as Promise<unknown>[]),
    );
    await service.findPublished({
      search: 'kem',
      landing: true,
      sortCreated: 'asc',
      page: 1,
      limit: 10,
    });
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'PUBLISHED',
          showOnLanding: true,
          title: { contains: 'kem', mode: 'insensitive' },
        }),
        orderBy: { createdAt: 'asc' },
      }),
    );
  });

  it('404 khi slug public không tồn tại', async () => {
    prisma.post.findFirst.mockResolvedValue(null);
    await expect(service.findPublishedBySlug('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('related 404 khi bài gốc không tồn tại', async () => {
    prisma.post.findFirst.mockResolvedValue(null);
    await expect(
      service.findRelated('missing', { page: 1, limit: 5 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('related trả bài khớp từ khóa tiêu đề', async () => {
    prisma.post.findFirst.mockResolvedValue({
      id: 'p1',
      title: 'Cách chọn bánh kem',
    });
    prisma.post.count.mockResolvedValue(1);
    prisma.post.findMany.mockResolvedValue([
      {
        id: 'p2',
        title: 'Bánh kem sinh nhật',
        slug: 'banh-kem-sinh-nhat',
        thumbnailUrl: null,
        content: '<p>x</p>',
        excerpt: null,
        status: 'PUBLISHED',
        showOnLanding: false,
        publishedAt: new Date(),
        seoTitle: null,
        seoDescription: null,
        author: { id: 'a1', fullName: 'Admin' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    prisma.$transaction.mockImplementation(async (ops: unknown[]) =>
      Promise.all(ops as Promise<unknown>[]),
    );

    const result = await service.findRelated('cach-chon-banh-kem', {
      page: 1,
      limit: 5,
    });
    expect(result.items).toHaveLength(1);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: 'p1' },
          status: 'PUBLISHED',
        }),
      }),
    );
  });

  it('xung đột slug', async () => {
    prisma.post.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );
    await expect(
      service.create('a1', {
        title: 'Test',
        content: '<p>x</p>',
        slug: 'test',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
