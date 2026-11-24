import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const createdOrderIds: string[] = [];
  const createdProductIds: string[] = [];
  const createdCategoryIds: string[] = [];
  const suffix = Date.now().toString();

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
  });

  afterAll(async () => {
    if (prisma && createdOrderIds.length > 0) {
      await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
    }
    if (prisma && createdProductIds.length > 0) {
      await prisma.product.deleteMany({
        where: { id: { in: createdProductIds } },
      });
    }
    if (prisma && createdCategoryIds.length > 0) {
      await prisma.category.deleteMany({
        where: { id: { in: createdCategoryIds } },
      });
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

  it('public tạo đơn kèm items/variant, tính tổng, admin cập nhật trạng thái', async () => {
    const category = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({ name: `Orders Cat ${suffix}` });
    expect(category.status).toBe(201);
    createdCategoryIds.push(category.body.data.id as string);

    const productA = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.body.data.id,
        sku: `ORD-A-${suffix}`,
        name: `Bánh A ${suffix}`,
        price: '200000',
        salePrice: '150000',
        status: 'PUBLISHED',
        images: [
          {
            url: 'https://cdn.example.com/a.jpg',
            isCover: true,
          },
        ],
        variants: [
          {
            sku: `ORD-A-${suffix}-S`,
            size: 'S',
            style: 'Tròn',
            price: '150000',
          },
        ],
      });
    expect(productA.status).toBe(201);
    createdProductIds.push(productA.body.data.id as string);
    const variantAId = productA.body.data.variants[0].id as string;

    const productB = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.body.data.id,
        sku: `ORD-B-${suffix}`,
        name: `Bánh B ${suffix}`,
        price: '100000',
        status: 'PUBLISHED',
        images: [
          {
            url: 'https://cdn.example.com/b.jpg',
            isCover: true,
          },
        ],
        variants: [
          {
            sku: `ORD-B-${suffix}-S`,
            size: 'S',
            style: 'Tròn',
            price: '100000',
          },
        ],
      });
    expect(productB.status).toBe(201);
    createdProductIds.push(productB.body.data.id as string);
    const variantBId = productB.body.data.variants[0].id as string;

    const phone = `090${suffix.slice(-7)}`;
    const created = await http()
      .post('/api/v1/public/orders/create')
      .send({
        items: [
          {
            productId: productA.body.data.id,
            variantId: variantAId,
            quantity: 1,
          },
          {
            productId: productB.body.data.id,
            variantId: variantBId,
            quantity: 1,
          },
        ],
        email: `order-${suffix}@example.com`,
        phone,
        fullName: 'Khách Mock',
        fulfillmentMethod: 'DELIVERY',
        shippingAddress: '12 Lê Lợi, Q.1',
        paymentMethod: 'BANK_TRANSFER',
        paymentImageUrl: 'https://cdn.example.com/uploads/orders/bill.jpg',
        deliveryDate: '2026-11-25',
        deliveryTime: '09:00-11:00',
        note: 'Giao buổi sáng',
      });
    expect(created.status).toBe(201);
    expect(created.body.data.status).toBe('PENDING_CONFIRMATION');
    expect(created.body.data.fulfillmentMethod).toBe('DELIVERY');
    expect(created.body.data.deliveryDate).toBe('2026-11-25');
    expect(created.body.data.totalAmount).toBe('250000.00');
    expect(created.body.data.items).toHaveLength(2);
    createdOrderIds.push(created.body.data.id as string);

    const pickup = await http()
      .post('/api/v1/public/orders/create')
      .send({
        items: [
          {
            productId: productA.body.data.id,
            variantId: variantAId,
            quantity: 2,
          },
        ],
        fullName: 'Nguyễn Văn A',
        phone: `092${suffix.slice(-7)}`,
        email: `pickup-${suffix}@example.com`,
        fulfillmentMethod: 'PICKUP',
        shippingAddress: null,
        deliveryDate: '2026-11-25',
        deliveryTime: '14:00-16:00',
        paymentMethod: 'AT_STORE',
        note: 'Nhận bánh tại cửa hàng',
      });
    expect(pickup.status).toBe(201);
    expect(pickup.body.data.fulfillmentMethod).toBe('PICKUP');
    expect(pickup.body.data.shippingAddress).toBeNull();
    expect(pickup.body.data.totalAmount).toBe('300000.00');
    createdOrderIds.push(pickup.body.data.id as string);

    const missingDate = await http()
      .post('/api/v1/public/orders/create')
      .send({
        items: [
          {
            productId: productA.body.data.id,
            variantId: variantAId,
            quantity: 1,
          },
        ],
        fullName: 'Khách',
        phone: `091${suffix.slice(-7)}`,
        fulfillmentMethod: 'DELIVERY',
        shippingAddress: '34 Hai Bà Trưng',
        paymentMethod: 'BANK_TRANSFER',
      });
    expect(missingDate.status).toBe(400);
    expect(missingDate.body.message).toBe(MESSAGES.DELIVERY_DATE_REQUIRED);

    const missingRequired = await http()
      .get('/api/v1/orders')
      .query({ search: phone })
      .set(bearer());
    expect(missingRequired.status).toBe(400);

    const list = await http()
      .get('/api/v1/orders')
      .query({
        page: 1,
        limit: 10,
        createdFrom: '2026-11-01',
        createdTo: '2026-12-31',
        search: phone,
        deliveryDate: '2026-11-25',
        deliveryTime: '09:00-11:00',
        status: ['PENDING_CONFIRMATION', 'CONFIRMED'],
      })
      .set(bearer());
    expect(list.status).toBe(200);
    expect(list.body.data.items.length).toBeGreaterThanOrEqual(1);
    expect(
      list.body.data.items.some(
        (item: { id: string }) => item.id === created.body.data.id,
      ),
    ).toBe(true);

    const detail = await http()
      .get(`/api/v1/orders/${created.body.data.id}`)
      .set(bearer());
    expect(detail.status).toBe(200);
    expect(detail.body.data.phone).toBe(phone);
    expect(
      detail.body.data.items.map((item: { productId: string }) => item.productId),
    ).toEqual([productA.body.data.id, productB.body.data.id]);

    const updated = await http()
      .put(`/api/v1/orders/${created.body.data.id}/update`)
      .set(bearer())
      .send({ status: 'CONFIRMED' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('CONFIRMED');
    expect(updated.body.message).toBe(MESSAGES.UPDATE_SUCCESS);

    const historyQuery = {
      page: 1,
      limit: 10,
      createdFrom: '2026-11-01',
      createdTo: '2026-12-31',
      search: phone,
    };

    const historyBeforeDone = await http()
      .get('/api/v1/orders/history')
      .query(historyQuery)
      .set(bearer());
    expect(historyBeforeDone.status).toBe(200);
    expect(
      historyBeforeDone.body.data.items.some(
        (item: { id: string }) => item.id === created.body.data.id,
      ),
    ).toBe(false);

    const completed = await http()
      .put(`/api/v1/orders/${created.body.data.id}/update`)
      .set(bearer())
      .send({ status: 'COMPLETED' });
    expect(completed.status).toBe(200);

    const history = await http()
      .get('/api/v1/orders/history')
      .query({ ...historyQuery, status: 'COMPLETED' })
      .set(bearer());
    expect(history.status).toBe(200);
    expect(
      history.body.data.items.some(
        (item: { id: string; status: string }) =>
          item.id === created.body.data.id && item.status === 'COMPLETED',
      ),
    ).toBe(true);

    const historyRejectedOnly = await http()
      .get('/api/v1/orders/history')
      .query({ ...historyQuery, status: 'REJECTED' })
      .set(bearer());
    expect(historyRejectedOnly.status).toBe(200);
    expect(
      historyRejectedOnly.body.data.items.some(
        (item: { id: string }) => item.id === created.body.data.id,
      ),
    ).toBe(false);
  });
});
