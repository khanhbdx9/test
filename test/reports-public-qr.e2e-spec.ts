import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/database/prisma/prisma.service';
import { SYSTEM_CONFIG_KEYS } from '../src/modules/system-configs/system-config.keys';

describe('Reports + public QR (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.systemConfig.upsert({
      where: { key: SYSTEM_CONFIG_KEYS.QR_PAYMENT },
      update: { value: 'https://cdn.example.com/qr-payment.png' },
      create: {
        key: SYSTEM_CONFIG_KEYS.QR_PAYMENT,
        value: 'https://cdn.example.com/qr-payment.png',
        description: 'QR payment',
      },
    });

    const login = await http().post('/api/v1/auth/login').send({
      email: process.env.SEED_SUPER_ADMIN_EMAIL,
      password: process.env.SEED_SUPER_ADMIN_PASSWORD,
    });
    token = login.body.data.accessToken as string;
  });

  afterAll(async () => {
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

  it('public đọc QR_PAYMENT và CMS lấy dashboard báo cáo', async () => {
    const qr = await http().get('/api/v1/public/p-con/qr');
    expect(qr.status).toBe(200);
    expect(qr.body.data.key).toBe('QR_PAYMENT');
    expect(qr.body.data.value).toContain('qr-payment');

    const missing = await http().get('/api/v1/reports/dashboard');
    expect(missing.status).toBe(401);

    const dashboard = await http()
      .get('/api/v1/reports/dashboard')
      .query({ from: '2026-01-01', to: '2026-12-31' })
      .set(bearer());
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.data.summary).toBeDefined();
    expect(dashboard.body.data.ordersByStatus).toBeDefined();
    expect(dashboard.body.data.revenueByDay).toBeDefined();
    expect(dashboard.body.data.topProducts).toBeDefined();

    const revenue = await http()
      .get('/api/v1/reports/revenue')
      .query({ from: '2026-01-01', to: '2026-12-31', topLimit: 5 })
      .set(bearer());
    expect(revenue.status).toBe(200);
    expect(revenue.body.data.summary.totalRevenue).toBeDefined();
  });
});
