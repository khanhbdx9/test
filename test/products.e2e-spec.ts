import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { PrismaService } from '../src/database/prisma/prisma.service';
import { prepareTestDatabase } from './prepare-database';

interface ImageItem {
  url: string;
  isCover: boolean;
}

interface ProductItem {
  id: string;
  slug: string;
  sku: string;
  price: string;
  isFeatured?: boolean;
  categorySlug?: string;
  images: ImageItem[];
}

describe('Products (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const productIds: string[] = [];
  const categoryIds: string[] = [];
  const roleIds: string[] = [];
  const userIds: string[] = [];
  const suffix = Date.now().toString();

  beforeAll(async () => {
    prepareTestDatabase();

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
    if (prisma && productIds.length > 0) {
      await prisma.product.deleteMany({ where: { id: { in: productIds } } });
    }
    if (prisma && categoryIds.length > 0) {
      await prisma.category.deleteMany({ where: { id: { in: categoryIds } } });
    }
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

  function bearer() {
    return { Authorization: `Bearer ${token}` };
  }

  let categorySeq = 0;

  async function createCategory(slugExtra = ''): Promise<{ id: string; slug: string }> {
    categorySeq += 1;
    const slug = `danh-muc-banh-${suffix}-${categorySeq}${slugExtra}`;
    const created = await http()
      .post('/api/v1/categories')
      .set(bearer())
      .send({ name: `Danh mục bánh ${suffix} ${categorySeq}`, slug });
    const id = created.body.data.id as string;
    categoryIds.push(id);
    return { id, slug };
  }

  it('tạo sản phẩm nhiều ảnh và chọn ảnh đại diện', async () => {
    const category = await createCategory();
    const created = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `BK-${suffix}`,
        name: `Bánh kem ${suffix}`,
        price: '250000',
        salePrice: '220000',
        images: [
          { url: 'https://cdn.example.com/a.jpg', sortOrder: 1 },
          {
            url: 'https://cdn.example.com/cover.jpg',
            sortOrder: 0,
            isCover: true,
            alt: 'Ảnh đại diện',
          },
        ],
      });

    expect(created.status).toBe(201);
    const product = created.body.data as ProductItem;
    productIds.push(product.id);
    expect(product.slug).toBe(`banh-kem-${suffix}`);
    expect(product.price).toBe('250000.00');
    expect(product.images).toHaveLength(2);
    expect(product.images.filter((image) => image.isCover)).toEqual([
      expect.objectContaining({ url: 'https://cdn.example.com/cover.jpg' }),
    ]);

    const expensive = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `BK-SALE-${suffix}`,
        name: 'Giá sai',
        price: '100000',
        salePrice: '100000',
      });
    expect(expensive.status).toBe(400);
    expect(expensive.body.message).toBe(MESSAGES.INVALID_SALE_PRICE);

    const twoCovers = await http()
      .patch(`/api/v1/products/${product.id}`)
      .set(bearer())
      .send({
        images: [
          { url: 'https://cdn.example.com/1.jpg', isCover: true },
          { url: 'https://cdn.example.com/2.jpg', isCover: true },
        ],
      });
    expect(twoCovers.status).toBe(400);
    expect(twoCovers.body.message).toBe(MESSAGES.INVALID_COVER);

    const replaced = await http()
      .patch(`/api/v1/products/${product.id}`)
      .set(bearer())
      .send({
        images: [
          { url: 'https://cdn.example.com/new-a.jpg', sortOrder: 2 },
          { url: 'https://cdn.example.com/new-cover.jpg', sortOrder: 1 },
        ],
      });
    expect(replaced.status).toBe(200);
    const next = replaced.body.data as ProductItem;
    expect(next.images).toHaveLength(2);
    expect(next.images.find((image) => image.isCover)?.url).toBe(
      'https://cdn.example.com/new-cover.jpg',
    );

    const listed = await http()
      .get('/api/v1/products')
      .query({ search: suffix, categoryId: category.id, isFeatured: false })
      .set(bearer());
    expect(listed.status).toBe(200);
    expect(listed.body.data.items.map((item: ProductItem) => item.id)).toContain(
      product.id,
    );

    const duplicate = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `BK-${suffix}`,
        name: 'Trùng mã',
        slug: `trung-ma-${suffix}`,
        price: '10000',
      });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.message).toBe(MESSAGES.SKU_IN_USE);

    const removed = await http()
      .delete(`/api/v1/products/${product.id}`)
      .set(bearer());
    expect(removed.status).toBe(200);
    const stored = await prisma.product.findUnique({ where: { id: product.id } });
    expect(stored?.deletedAt).toBeTruthy();
    expect(stored?.sku).toBe(`deleted.${product.id}`);
    expect(stored?.slug).toBe(`deleted.${product.id}`);
  });

  it('từ chối tạo sản phẩm khi không có quyền', async () => {
    const role = await http()
      .post('/api/v1/roles')
      .set(bearer())
      .send({ code: `E2E_PRODUCT_${suffix}`, name: 'Không có sản phẩm' });
    roleIds.push(role.body.data.id as string);
    const email = `e2e-product-${suffix}@minhsam.local`;
    const password = 'Product123';
    const user = await http()
      .post('/api/v1/users')
      .set(bearer())
      .send({
        email,
        password,
        fullName: 'Không quyền sản phẩm',
        roleId: role.body.data.id,
      });
    userIds.push(user.body.data.id as string);
    const session = await http().post('/api/v1/auth/login').send({ email, password });

    const denied = await http()
      .post('/api/v1/products')
      .set({ Authorization: `Bearer ${session.body.data.accessToken}` })
      .send({
        categoryId: '00000000-0000-4000-8000-000000000000',
        sku: 'NOPE',
        name: 'Bị cấm',
        price: '10000',
      });
    expect(denied.status).toBe(403);
    expect(denied.body.message).toBe(MESSAGES.FORBIDDEN);
  });

  it('thay toàn bộ biến thể và xóa mềm đổi SKU biến thể', async () => {
    const category = await createCategory();
    const created = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `VAR-${suffix}`,
        name: `Bánh biến thể ${suffix}`,
        price: '100000',
        variants: [
          { sku: `VAR-${suffix}-16`, size: '16cm', style: 'Dâu', price: '250000' },
          {
            sku: `VAR-${suffix}-20`,
            size: '20cm',
            style: 'Socola',
            price: '320000',
            salePrice: '300000',
            sortOrder: 1,
          },
        ],
      });
    expect(created.status).toBe(201);
    const productId = created.body.data.id as string;
    productIds.push(productId);
    expect(created.body.data.variants).toEqual([
      expect.objectContaining({
        sku: `VAR-${suffix}-16`,
        size: '16cm',
        style: 'Dâu',
        price: '250000.00',
        status: 'ACTIVE',
      }),
      expect.objectContaining({
        sku: `VAR-${suffix}-20`,
        salePrice: '300000.00',
      }),
    ]);

    const duplicated = await http()
      .patch(`/api/v1/products/${productId}`)
      .set(bearer())
      .send({
        variants: [
          { sku: `VAR-${suffix}-16`, size: '16cm', style: 'Dâu', price: '250000' },
          { sku: `VAR-${suffix}-16`, size: '18cm', style: 'Dâu', price: '280000' },
        ],
      });
    expect(duplicated.status).toBe(400);
    expect(duplicated.body.message).toBe(MESSAGES.DUPLICATE_VARIANT_SKU);

    const removed = await http()
      .delete(`/api/v1/products/${productId}`)
      .set(bearer());
    expect(removed.status).toBe(200);
    const stored = await prisma.productVariant.findMany({
      where: { productId },
    });
    expect(stored.map((item) => item.sku).sort()).toEqual(
      stored.map((item) => `deleted.${item.id}`).sort(),
    );
  });

  it('api public theo danh mục, slug, ưu tiên nổi bật và sản phẩm liên quan', async () => {
    const category = await createCategory();
    const older = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `PUB-OLD-${suffix}`,
        name: `Bánh cũ ${suffix}`,
        slug: `banh-cu-${suffix}`,
        price: '100000',
        status: 'PUBLISHED',
        isFeatured: false,
      });
    const featured = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `PUB-FEAT-${suffix}`,
        name: `Bánh nổi bật ${suffix}`,
        slug: `banh-noi-bat-${suffix}`,
        price: '150000',
        status: 'PUBLISHED',
        isFeatured: true,
      });
    const draft = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `PUB-DRAFT-${suffix}`,
        name: `Bánh nháp ${suffix}`,
        slug: `banh-nhap-${suffix}`,
        price: '90000',
        status: 'DRAFT',
      });
    const related = await http()
      .post('/api/v1/products')
      .set(bearer())
      .send({
        categoryId: category.id,
        sku: `PUB-REL-${suffix}`,
        name: `Bánh liên quan ${suffix}`,
        slug: `banh-lien-quan-${suffix}`,
        price: '120000',
        status: 'PUBLISHED',
      });
    productIds.push(
      older.body.data.id as string,
      featured.body.data.id as string,
      draft.body.data.id as string,
      related.body.data.id as string,
    );

    const listed = await http()
      .get('/api/v1/public/products')
      .query({ categorySlug: category.slug, limit: 20 });
    expect(listed.status).toBe(200);
    const items = listed.body.data.items as ProductItem[];
    expect(items.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        featured.body.data.id,
        older.body.data.id,
        related.body.data.id,
      ]),
    );
    expect(items.map((item) => item.id)).not.toContain(draft.body.data.id);
    expect(items[0].id).toBe(featured.body.data.id);

    const detail = await http().get(
      `/api/v1/public/products/${category.slug}/banh-noi-bat-${suffix}`,
    );
    expect(detail.status).toBe(200);
    expect(detail.body.data.slug).toBe(`banh-noi-bat-${suffix}`);
    expect(detail.body.data.categorySlug).toBe(category.slug);

    const hiddenDraft = await http().get(
      `/api/v1/public/products/${category.slug}/banh-nhap-${suffix}`,
    );
    expect(hiddenDraft.status).toBe(404);

    const relatedList = await http()
      .get(
        `/api/v1/public/products/${category.slug}/banh-noi-bat-${suffix}/related`,
      )
      .query({ limit: 20 });
    expect(relatedList.status).toBe(200);
    const relatedItems = relatedList.body.data.items as ProductItem[];
    expect(relatedItems.map((item) => item.id)).toContain(related.body.data.id);
    expect(relatedItems.map((item) => item.id)).not.toContain(
      featured.body.data.id,
    );
  });
});
