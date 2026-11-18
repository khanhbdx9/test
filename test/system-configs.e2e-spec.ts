import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('System configs (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const createdIds: string[] = [];
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
    if (prisma && createdIds.length > 0) {
      await prisma.systemConfig.deleteMany({
        where: { id: { in: createdIds } },
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

  it('CRUD cấu hình và seed EMAIL_NOTIFICATION', async () => {
    const listSeed = await http()
      .get('/api/v1/system-configs')
      .query({ search: 'EMAIL_NOTIFICATION' })
      .set(bearer());
    expect(listSeed.status).toBe(200);
    expect(
      listSeed.body.data.items.some(
        (item: { key: string }) => item.key === 'EMAIL_NOTIFICATION',
      ),
    ).toBe(true);

    const key = `SHOP_NOTE_${suffix}`;
    const created = await http()
      .post('/api/v1/system-configs')
      .set(bearer())
      .send({
        key,
        value: 'ghi chú cửa hàng',
        description: 'test',
      });
    expect(created.status).toBe(201);
    createdIds.push(created.body.data.id as string);

    const updated = await http()
      .patch(`/api/v1/system-configs/${created.body.data.id}`)
      .set(bearer())
      .send({ value: 'đã cập nhật' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.value).toBe('đã cập nhật');

    const dup = await http()
      .post('/api/v1/system-configs')
      .set(bearer())
      .send({ key, value: 'x' });
    expect(dup.status).toBe(409);
    expect(dup.body.message).toBe(MESSAGES.CONFIG_KEY_IN_USE);

    const removed = await http()
      .delete(`/api/v1/system-configs/${created.body.data.id}`)
      .set(bearer());
    expect(removed.status).toBe(200);
    createdIds.pop();
  });
});
