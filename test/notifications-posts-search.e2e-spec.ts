import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('Notifications, posts, public search (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let userId: string;
  const suffix = Date.now().toString();
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCategoryIds: string[] = [];
  const createdPostIds: string[] = [];
  const createdNotificationIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);

    const login = await http().post('/api/v1/auth/login').send({
      email: process.env.SEED_SUPER_ADMIN_EMAIL,
      password: process.env.SEED_SUPER_ADMIN_PASSWORD,
    });
    token = login.body.data.accessToken as string;
    userId = login.body.data.user.id as string;
  });

  afterAll(async () => {
    if (prisma) {
      if (createdNotificationIds.length > 0) {
        await prisma.notification.deleteMany({
          where: { id: { in: createdNotificationIds } },
        });
      }
      if (createdOrderIds.length > 0) {
        await prisma.order.deleteMany({
          where: { id: { in: createdOrderIds } },
        });
      }
      if (createdPostIds.length > 0) {
        await prisma.post.deleteMany({
          where: { id: { in: createdPostIds } },
        });
      }
      if (createdProductIds.length > 0) {
        await prisma.product.deleteMany({
          where: { id: { in: createdProductIds } },
        });
      }
      if (createdCategoryIds.length > 0) {
        await prisma.category.deleteMany({
          where: { id: { in: createdCategoryIds } },
        });
      }
    }
    if (app) {
      await app.close();
    }
  });

  function http() {
    return request(app.getHttpServer());
  }

  function bearer() {
    return { Authorization: `Bearer ${token}` };
  }

  it('tạo đơn sinh notification, posts CRUD/public, search POST', async () => {
    const category = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({ name: `Search Cat ${suffix}` });
    expect(category.status).toBe(201);
    createdCategoryIds.push(category.body.data.id as string);

    const product = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.body.data.id,
        sku: `SRCH-${suffix}`,
        name: `Bánh kem search ${suffix}`,
        price: '250000',
        status: 'PUBLISHED',
        images: [
          { url: 'https://cdn.example.com/search.jpg', isCover: true },
        ],
        variants: [
          {
            sku: `SRCH-${suffix}-S`,
            size: 'S',
            style: 'Tròn',
            price: '250000',
          },
        ],
      });
    expect(product.status).toBe(201);
    createdProductIds.push(product.body.data.id as string);

    const order = await http()
      .post('/api/v1/public/orders/create')
      .send({
        items: [
          {
            productId: product.body.data.id,
            variantId: product.body.data.variants[0].id,
            quantity: 1,
          },
        ],
        phone: `091${suffix.slice(-7)}`,
        fullName: 'Khách Test',
        fulfillmentMethod: 'DELIVERY',
        shippingAddress: '123 Test',
        paymentMethod: 'AT_STORE',
      });
    expect(order.status).toBe(201);
    createdOrderIds.push(order.body.data.id as string);

    await new Promise((resolve) => setTimeout(resolve, 200));

    const notifications = await http()
      .get('/api/v1/notifications')
      .set(bearer())
      .query({ isRead: false });
    expect(notifications.status).toBe(200);
    const created = (
      notifications.body.data.items as Array<{
        id: string;
        type: string;
        metadata?: { orderId?: string };
      }>
    ).find((item) => item.metadata?.orderId === order.body.data.id);
    expect(created).toBeDefined();
    if (created) {
      createdNotificationIds.push(created.id);
    }

    const unread = await http()
      .get('/api/v1/notifications/unread-count')
      .set(bearer());
    expect(unread.status).toBe(200);
    expect(unread.body.data.count).toBeGreaterThanOrEqual(1);

    const detail = await http()
      .get(`/api/v1/notifications/${created!.id}`)
      .set(bearer());
    expect(detail.status).toBe(200);
    expect(detail.body.data.type).toBe('ORDER_CREATED');

    const markRead = await http()
      .patch(`/api/v1/notifications/${created!.id}/read`)
      .set(bearer());
    expect(markRead.status).toBe(200);
    expect(markRead.body.data.isRead).toBe(true);

    const markUnread = await http()
      .patch(`/api/v1/notifications/${created!.id}/unread`)
      .set(bearer());
    expect(markUnread.status).toBe(200);
    expect(markUnread.body.data.isRead).toBe(false);

    const bulk = await http()
      .post('/api/v1/notifications/bulk-read')
      .set(bearer())
      .send({ ids: [created!.id] });
    expect(bulk.status).toBe(201);
    expect(bulk.body.data.updated).toBeGreaterThanOrEqual(1);

    const draft = await http()
      .post('/api/v1/posts')
      .set(bearer())
      .send({
        title: `Bài viết ${suffix}`,
        content: '<p>Nội dung <strong>CKEditor</strong></p>',
        excerpt: 'Tóm tắt',
        showOnLanding: true,
      });
    expect(draft.status).toBe(201);
    createdPostIds.push(draft.body.data.id as string);
    expect(draft.body.data.content).toContain('<strong>CKEditor</strong>');
    expect(draft.body.data.status).toBe('DRAFT');
    expect(draft.body.data.showOnLanding).toBe(true);

    const published = await http()
      .patch(`/api/v1/posts/${draft.body.data.id}/publish`)
      .set(bearer());
    expect(published.status).toBe(200);
    expect(published.body.data.status).toBe('PUBLISHED');

    const publicPosts = await http()
      .get('/api/v1/public/posts')
      .query({
        search: `Bài viết ${suffix}`,
        sortCreated: 'desc',
        landing: false,
      });
    expect(publicPosts.status).toBe(200);
    expect(
      publicPosts.body.data.items.some(
        (item: { id: string }) => item.id === draft.body.data.id,
      ),
    ).toBe(true);

    const landingPosts = await http()
      .get('/api/v1/public/posts')
      .query({ landing: true, search: suffix });
    expect(landingPosts.status).toBe(200);
    expect(
      landingPosts.body.data.items.every(
        (item: { showOnLanding: boolean }) => item.showOnLanding === true,
      ),
    ).toBe(true);
    expect(
      landingPosts.body.data.items.some(
        (item: { id: string }) => item.id === draft.body.data.id,
      ),
    ).toBe(true);

    const publicPost = await http().get(
      `/api/v1/public/posts/${published.body.data.slug}`,
    );
    expect(publicPost.status).toBe(200);
    expect(publicPost.body.data.author.id).toBe(userId);

    const related = await http()
      .get(`/api/v1/public/posts/${published.body.data.slug}/related`)
      .query({ page: 1, limit: 5 });
    expect(related.status).toBe(200);
    expect(related.body.data.items).toBeDefined();
    expect(
      related.body.data.items.every(
        (item: { id: string }) => item.id !== draft.body.data.id,
      ),
    ).toBe(true);

    const filtered = await http()
      .post('/api/v1/public/filter')
      .send({
        search: `search ${suffix}`,
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sort: 'desc',
      });
    expect(filtered.status).toBe(200);
    expect(filtered.body.data.search).toContain(suffix);
    expect(
      filtered.body.data.products.some(
        (item: { id: string }) => item.id === product.body.data.id,
      ),
    ).toBe(true);
    expect(filtered.body.data.pagination).toBeDefined();
  });
});
