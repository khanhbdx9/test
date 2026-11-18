import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { PrismaService } from '../src/database/prisma/prisma.service';

interface CategoryItem {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  status: string;
}

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const createdIds: string[] = [];
  const createdRoleIds: string[] = [];
  const createdUserIds: string[] = [];
  const suffix = Date.now().toString();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);

    const login = await http()
      .post('/api/v1/auth/login')
      .send({
        email: process.env.SEED_SUPER_ADMIN_EMAIL,
        password: process.env.SEED_SUPER_ADMIN_PASSWORD,
      });
    token = login.body.data.accessToken as string;
  });

  afterAll(async () => {
    if (prisma && createdIds.length > 0) {
      await prisma.category.updateMany({
        where: { id: { in: createdIds } },
        data: { parentId: null },
      });
      await prisma.category.deleteMany({ where: { id: { in: createdIds } } });
    }
    if (prisma && createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    if (prisma && createdRoleIds.length > 0) {
      await prisma.role.deleteMany({ where: { id: { in: createdRoleIds } } });
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

  it('tạo danh mục, sinh slug, lọc và từ chối vòng cha con', async () => {
    const created = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({
        name: `Bánh kem ${suffix}`,
        sortOrder: 1,
      });
    expect(created.status).toBe(201);
    expect(created.body.code).toBe(201);
    expect(created.body.message).toBe(MESSAGES.CREATED);
    const parent = created.body.data as CategoryItem;
    createdIds.push(parent.id);
    expect(parent.slug).toBe(`banh-kem-${suffix}`);
    expect(parent.parentId).toBeNull();

    const child = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({
        name: `Dâu ${suffix}`,
        slug: `dau-${suffix}`,
        parentId: parent.id,
        status: 'HIDDEN',
      });
    expect(child.status).toBe(201);
    createdIds.push(child.body.data.id as string);

    const listed = await http()
      .get('/api/v1/categories')
      .query({ parentId: parent.id, status: 'HIDDEN', search: suffix })
      .set(bearer());
    expect(listed.status).toBe(200);
    expect(listed.body.data.items).toEqual([
      expect.objectContaining({ id: child.body.data.id, slug: `dau-${suffix}` }),
    ]);

    const cycle = await http()
      .patch(`/api/v1/categories/${parent.id}`)
      .set(bearer())
      .send({ parentId: child.body.data.id });
    expect(cycle.status).toBe(400);
    expect(cycle.body.message).toBe(MESSAGES.INVALID_PARENT);

    const selfParent = await http()
      .patch(`/api/v1/categories/${parent.id}`)
      .set(bearer())
      .send({ parentId: parent.id });
    expect(selfParent.status).toBe(400);

    const blocked = await http()
      .delete(`/api/v1/categories/${parent.id}`)
      .set(bearer());
    expect(blocked.status).toBe(409);
    expect(blocked.body.message).toBe(MESSAGES.CATEGORY_HAS_CHILDREN);

    const removed = await http()
      .delete(`/api/v1/categories/${child.body.data.id}`)
      .set(bearer());
    expect(removed.status).toBe(200);
    expect(removed.body.message).toBe(MESSAGES.DELETE_SUCCESS);

    const stored = await prisma.category.findUnique({
      where: { id: child.body.data.id as string },
    });
    expect(stored?.deletedAt).toBeTruthy();
    expect(stored?.slug).toBe(`deleted.${child.body.data.id}`);

    const missing = await http()
      .get(`/api/v1/categories/${child.body.data.id}`)
      .set(bearer());
    expect(missing.status).toBe(404);

    const duplicate = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({ name: 'Trùng slug', slug: parent.slug });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.message).toBe(MESSAGES.SLUG_IN_USE);
  });

  it('từ chối tạo danh mục khi không có quyền', async () => {
    const role = await http()
      .post('/api/v1/roles')
      .set(bearer())
      .send({ code: `E2E_CAT_${suffix}`, name: 'Không có danh mục' });
    createdRoleIds.push(role.body.data.id as string);
    const email = `e2e-cat-${suffix}@minhsam.local`;
    const password = 'Category1';
    const user = await http()
      .post('/api/v1/users')
      .set(bearer())
      .send({
        email,
        password,
        fullName: 'Không quyền danh mục',
        roleId: role.body.data.id,
      });
    createdUserIds.push(user.body.data.id as string);
    const session = await http()
      .post('/api/v1/auth/login')
      .send({ email, password });

    const denied = await http()
      .post('/api/v1/categories')
      .set({ Authorization: `Bearer ${session.body.data.accessToken}` })
      .send({ name: 'Bị cấm' });
    expect(denied.status).toBe(403);
    expect(denied.body.message).toBe(MESSAGES.FORBIDDEN);
  });

  it('api e2e không cần token và chỉ trả danh mục đang hiển thị', async () => {
    const visible = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({ name: `Hiện ${suffix}`, slug: `hien-${suffix}`, status: 'VISIBLE' });
    const hidden = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({ name: `Ẩn ${suffix}`, slug: `an-${suffix}`, status: 'HIDDEN' });
    createdIds.push(visible.body.data.id as string, hidden.body.data.id as string);

    const listed = await http()
      .get('/api/v1/public/categories')
      .query({ search: suffix, limit: 100 });
    expect(listed.status).toBe(200);
    const items = listed.body.data.items as CategoryItem[];
    expect(items.map((item) => item.id)).toContain(visible.body.data.id);
    expect(items.map((item) => item.status)).not.toContain('HIDDEN');

    const shown = await http().get(
      `/api/v1/public/categories/${visible.body.data.id}`,
    );
    expect(shown.status).toBe(200);
    expect(shown.body.data.status).toBe('VISIBLE');

    const concealed = await http().get(
      `/api/v1/public/categories/${hidden.body.data.id}`,
    );
    expect(concealed.status).toBe(404);
  });
});
