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

  it('public tạo đơn kèm sản phẩm, tính tổng, admin cập nhật trạng thái', async () => {
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

    const phone = `090${suffix.slice(-7)}`;
    const created = await http()
      .post('/api/v1/public/orders/create')
      .send({
        email: `order-${suffix}@example.com`,
        phone,
        shippingAddress: '12 Lê Lợi, Q.1',
        fullName: 'Khách Mock',
        paymentMethod: 'BANK_TRANSFER',
        paymentImageUrl: 'https://cdn.example.com/uploads/orders/bill.jpg',
        deliveryDate: '2026-11-25',
        deliveryTime: '09:00-11:00',
        note: 'Giao buổi sáng',
        productIds: [productA.body.data.id, productB.body.data.id],
      });
    expect(created.status).toBe(201);
    expect(created.body.data.status).toBe('PENDING_CONFIRMATION');
    expect(created.body.data.deliveryDate).toBe('2026-11-25');
    expect(created.body.data.totalAmount).toBe('250000.00');
    expect(created.body.data.products).toHaveLength(2);
    createdOrderIds.push(created.body.data.id as string);

    const missingDate = await http()
      .post('/api/v1/public/orders/create')
      .send({
        phone: `091${suffix.slice(-7)}`,
        shippingAddress: '34 Hai Bà Trưng',
        paymentMethod: 'BANK_TRANSFER',
        productIds: [productA.body.data.id],
      });
    expect(missingDate.status).toBe(400);
    expect(missingDate.body.message).toBe(MESSAGES.DELIVERY_DATE_REQUIRED);

    const list = await http()
      .get('/api/v1/orders')
      .query({
        search: phone,
        deliveryDate: '2026-11-25',
        deliveryTime: '09:00-11:00',
        status: ['PENDING_CONFIRMATION', 'CONFIRMED'],
        sortCreated: 'desc',
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
    expect(detail.body.data.productIds).toEqual([
      productA.body.data.id,
      productB.body.data.id,
    ]);

    const updated = await http()
      .put(`/api/v1/orders/${created.body.data.id}/update`)
      .set(bearer())
      .send({ status: 'CONFIRMED' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('CONFIRMED');
    expect(updated.body.message).toBe(MESSAGES.UPDATE_SUCCESS);
  });
});
