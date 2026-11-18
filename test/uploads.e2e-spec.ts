import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { PrismaService } from '../src/database/prisma/prisma.service';

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

describe('Uploads (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const roleIds: string[] = [];
  const userIds: string[] = [];
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
    if (prisma && userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    if (prisma && roleIds.length > 0) {
      await prisma.role.deleteMany({ where: { id: { in: roleIds } } });
    }
    if (app) {
      await app.close();
    }
  });

  function http() {
    return request(app.getHttpServer());
  }

  it('upload nhiều jpeg theo folder client truyền và trả URL đọc được', async () => {
    const folder = `products/banh-kem-${suffix}/banh-dau-${suffix}`;
    const created = await http()
      .post('/api/v1/uploads/images')
      .query({ folder })
      .set({ Authorization: `Bearer ${token}` })
      .attach('files', jpeg, { filename: 'banh-1.jpg', contentType: 'image/jpeg' })
      .attach('files', jpeg, { filename: 'banh-2.jpg', contentType: 'image/jpeg' });

    expect(created.status).toBe(201);
    expect(created.body.message).toBe(MESSAGES.CREATED);
    expect(created.body.data).toHaveLength(2);
    const url = new URL(created.body.data[0].url as string);
    expect(url.pathname).toContain(`/uploads/${folder}/`);
    const file = await http().get(url.pathname);
    expect(file.status).toBe(200);
  });

  it('upload không truyền folder thì lưu trong uploads root', async () => {
    const created = await http()
      .post('/api/v1/uploads/images')
      .set({ Authorization: `Bearer ${token}` })
      .attach('files', jpeg, { filename: 'root.jpg', contentType: 'image/jpeg' });

    expect(created.status).toBe(201);
    const url = new URL(created.body.data[0].url as string);
    expect(url.pathname).toMatch(/^\/uploads\/[^/]+\.jpg$/);
    const file = await http().get(url.pathname);
    expect(file.status).toBe(200);
  });

  it('từ chối tổng dung lượng vượt 10MB và file không phải ảnh', async () => {
    const oversized = Buffer.alloc(6 * 1024 * 1024, 0xff);
    oversized[0] = 0xff;
    oversized[1] = 0xd8;
    oversized[2] = 0xff;
    const folder = `products/banh-kem-${suffix}/banh-lon-${suffix}`;
    const overTotal = await http()
      .post('/api/v1/uploads/images')
      .query({ folder })
      .set({ Authorization: `Bearer ${token}` })
      .attach('files', oversized, {
        filename: 'big-1.jpg',
        contentType: 'image/jpeg',
      })
      .attach('files', oversized, {
        filename: 'big-2.jpg',
        contentType: 'image/jpeg',
      });
    expect(overTotal.status).toBe(400);
    expect(overTotal.body.message).toBe(MESSAGES.FILE_TOO_LARGE);

    const invalid = await http()
      .post('/api/v1/uploads/images')
      .query({ folder })
      .set({ Authorization: `Bearer ${token}` })
      .attach('files', Buffer.from('not-an-image'), {
        filename: 'note.txt',
        contentType: 'text/plain',
      });
    expect(invalid.status).toBe(400);
    expect(invalid.body.message).toBe(MESSAGES.INVALID_IMAGE);

    const badFolder = await http()
      .post('/api/v1/uploads/images')
      .query({ folder: '../etc' })
      .set({ Authorization: `Bearer ${token}` })
      .attach('files', jpeg, { filename: 'banh.jpg', contentType: 'image/jpeg' });
    expect(badFolder.status).toBe(400);
    expect(badFolder.body.message).toBe(MESSAGES.UPLOAD_FOLDER_INVALID);

    const missing = await http().post('/api/v1/uploads/images');
    expect(missing.status).toBe(401);

    const role = await http()
      .post('/api/v1/roles')
      .set({ Authorization: `Bearer ${token}` })
      .send({ code: `E2E_UPLOAD_${suffix}`, name: 'Không upload' });
    roleIds.push(role.body.data.id as string);
    const email = `e2e-upload-${suffix}@minhsam.local`;
    const password = 'Upload1234';
    const user = await http()
      .post('/api/v1/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email,
        password,
        fullName: 'Không quyền upload',
        roleId: role.body.data.id,
      });
    userIds.push(user.body.data.id as string);
    const session = await http().post('/api/v1/auth/login').send({ email, password });
    const denied = await http()
      .post('/api/v1/uploads/images')
      .query({ folder: `banners/home-${suffix}` })
      .set({ Authorization: `Bearer ${session.body.data.accessToken}` })
      .attach('files', jpeg, { filename: 'banh.jpg', contentType: 'image/jpeg' });
    expect(denied.status).toBe(403);
  });
});
