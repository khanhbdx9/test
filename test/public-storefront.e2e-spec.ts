import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('Public storefront (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const themeIds: string[] = [];
  const bannerIds: string[] = [];
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
    if (prisma) {
      if (bannerIds.length > 0) {
        await prisma.banner.deleteMany({ where: { id: { in: bannerIds } } });
      }
      if (themeIds.length > 0) {
        await prisma.theme.deleteMany({ where: { id: { in: themeIds } } });
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

  it('admin CRUD theme/banner và public storefront đọc được', async () => {
    const theme = await http()
      .post('/api/v1/themes')
      .set(bearer())
      .send({
        name: `Theme ${suffix}`,
        code: `theme-${suffix}`,
        config: { primaryColor: '#8b3a2b' },
        isActive: true,
      });
    expect(theme.status).toBe(201);
    themeIds.push(theme.body.data.id as string);

    const banner = await http()
      .post('/api/v1/banners')
      .set(bearer())
      .send({
        title: `Banner ${suffix}`,
        desktopImageUrl: 'https://cdn.example.com/banner-desktop.jpg',
        mobileImageUrl: 'https://cdn.example.com/banner-mobile.jpg',
        position: 'home_hero',
        sortOrder: 1,
        isActive: true,
      });
    expect(banner.status).toBe(201);
    bannerIds.push(banner.body.data.id as string);

    const publicTheme = await http().get('/api/v1/public/theme');
    expect(publicTheme.status).toBe(200);
    expect(publicTheme.body.data.code).toBe(`theme-${suffix}`);

    const publicBanners = await http()
      .get('/api/v1/public/banners')
      .query({ position: 'home_hero' });
    expect(publicBanners.status).toBe(200);
    expect(
      publicBanners.body.data.some(
        (item: { id: string }) => item.id === banner.body.data.id,
      ),
    ).toBe(true);

    const categories = await http().get('/api/v1/public/categories');
    expect(categories.status).toBe(200);
    expect(categories.body.data.items).toBeDefined();

    const products = await http().get('/api/v1/public/products');
    expect(products.status).toBe(200);
    expect(products.body.data.items).toBeDefined();
  });
});
