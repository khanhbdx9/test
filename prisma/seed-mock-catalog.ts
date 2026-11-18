import { PrismaPg } from '@prisma/adapter-pg';
import {
  CategoryStatus,
  PrismaClient,
  ProductStatus,
  VariantStatus,
} from '../src/generated/prisma/client';

// Seed mock riêng — không nằm trong prisma db seed (RBAC).
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config({ path: '.env' });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

type MockCategory = {
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  parentSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type MockVariant = {
  sku: string;
  size: string;
  style: string;
  price: string;
  salePrice?: string;
  sortOrder?: number;
};

type MockImage = {
  url: string;
  alt?: string;
  sortOrder?: number;
  isCover?: boolean;
};

type MockProduct = {
  sku: string;
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: string;
  salePrice?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  images: MockImage[];
  variants: MockVariant[];
};

const CATEGORIES: MockCategory[] = [
  {
    slug: 'banh-kem',
    name: 'Bánh kem',
    description: 'Bánh kem theo dịp và theo chủ đề',
    imageUrl: '/uploads/categories/banh-kem.jpg',
    sortOrder: 1,
    seoTitle: 'Bánh kem',
    seoDescription: 'Danh mục bánh kem',
  },
  {
    slug: 'banh-sinh-nhat',
    name: 'Bánh sinh nhật',
    description: 'Bánh kem sinh nhật các kích cỡ',
    imageUrl: '/uploads/categories/banh-sinh-nhat.jpg',
    sortOrder: 1,
    parentSlug: 'banh-kem',
  },
  {
    slug: 'banh-cuoi',
    name: 'Bánh cưới',
    description: 'Bánh cưới nhiều tầng',
    imageUrl: '/uploads/categories/banh-cuoi.jpg',
    sortOrder: 2,
    parentSlug: 'banh-kem',
  },
  {
    slug: 'banh-ngot',
    name: 'Bánh ngọt',
    description: 'Pastry, tart và bánh ngọt ăn liền',
    imageUrl: '/uploads/categories/banh-ngot.jpg',
    sortOrder: 2,
  },
  {
    slug: 'banh-mi',
    name: 'Bánh mì',
    description: 'Bánh mì ngọt và mặn',
    imageUrl: '/uploads/categories/banh-mi.jpg',
    sortOrder: 3,
  },
];

const PRODUCTS: MockProduct[] = [
  {
    sku: 'CAKE-SN-001',
    slug: 'banh-kem-vanilla-classic',
    name: 'Bánh kem Vanilla Classic',
    categorySlug: 'banh-sinh-nhat',
    shortDescription: 'Kem tươi vanilla, cốt bông lan',
    description:
      'Bánh kem vanilla cổ điển, phù hợp sinh nhật và tiệc gia đình. Có thể ghi chữ theo yêu cầu.',
    price: '350000',
    salePrice: '299000',
    status: ProductStatus.PUBLISHED,
    isFeatured: true,
    isBestSeller: true,
    images: [
      {
        url: '/uploads/products/banh-sinh-nhat/banh-kem-vanilla-classic/cover.jpg',
        alt: 'Bánh kem Vanilla Classic',
        sortOrder: 0,
        isCover: true,
      },
      {
        url: '/uploads/products/banh-sinh-nhat/banh-kem-vanilla-classic/2.jpg',
        alt: 'Cắt ngang bánh',
        sortOrder: 1,
      },
    ],
    variants: [
      {
        sku: 'CAKE-SN-001-S',
        size: 'S',
        style: 'Tròn',
        price: '350000',
        salePrice: '299000',
        sortOrder: 0,
      },
      {
        sku: 'CAKE-SN-001-M',
        size: 'M',
        style: 'Tròn',
        price: '450000',
        salePrice: '399000',
        sortOrder: 1,
      },
      {
        sku: 'CAKE-SN-001-L',
        size: 'L',
        style: 'Tròn',
        price: '550000',
        sortOrder: 2,
      },
    ],
  },
  {
    sku: 'CAKE-SN-002',
    slug: 'banh-kem-chocolate-fudge',
    name: 'Bánh kem Chocolate Fudge',
    categorySlug: 'banh-sinh-nhat',
    shortDescription: 'Socola đậm, ganache bóng',
    description: 'Bánh socola nhiều lớp với ganache và vụn socola.',
    price: '380000',
    status: ProductStatus.PUBLISHED,
    isFeatured: true,
    images: [
      {
        url: '/uploads/products/banh-sinh-nhat/banh-kem-chocolate-fudge/cover.jpg',
        alt: 'Bánh kem Chocolate Fudge',
        isCover: true,
      },
    ],
    variants: [
      {
        sku: 'CAKE-SN-002-S',
        size: 'S',
        style: 'Tròn',
        price: '380000',
      },
      {
        sku: 'CAKE-SN-002-M',
        size: 'M',
        style: 'Tròn',
        price: '480000',
      },
    ],
  },
  {
    sku: 'CAKE-CU-001',
    slug: 'banh-cuoi-hai-tang',
    name: 'Bánh cưới hai tầng',
    categorySlug: 'banh-cuoi',
    shortDescription: 'Hai tầng kem trắng, hoa trang trí',
    description: 'Bánh cưới tối giản, phủ kem trắng và hoa đường.',
    price: '2500000',
    status: ProductStatus.PUBLISHED,
    isBestSeller: true,
    images: [
      {
        url: '/uploads/products/banh-cuoi/banh-cuoi-hai-tang/cover.jpg',
        alt: 'Bánh cưới hai tầng',
        isCover: true,
      },
    ],
    variants: [
      {
        sku: 'CAKE-CU-001-STD',
        size: '2 tầng',
        style: 'Tròn',
        price: '2500000',
      },
      {
        sku: 'CAKE-CU-001-PRE',
        size: '3 tầng',
        style: 'Tròn',
        price: '3500000',
      },
    ],
  },
  {
    sku: 'SWEET-001',
    slug: 'banh-su-kem',
    name: 'Bánh su kem',
    categorySlug: 'banh-ngot',
    shortDescription: 'Vỏ giòn, nhân kem vani',
    description: 'Hộp 6 cái su kem nhân vani.',
    price: '89000',
    salePrice: '79000',
    status: ProductStatus.PUBLISHED,
    isFeatured: true,
    images: [
      {
        url: '/uploads/products/banh-ngot/banh-su-kem/cover.jpg',
        alt: 'Bánh su kem',
        isCover: true,
      },
    ],
    variants: [
      {
        sku: 'SWEET-001-6',
        size: '6 cái',
        style: 'Hộp',
        price: '89000',
        salePrice: '79000',
      },
      {
        sku: 'SWEET-001-12',
        size: '12 cái',
        style: 'Hộp',
        price: '159000',
      },
    ],
  },
  {
    sku: 'SWEET-002',
    slug: 'tart-trai-cay',
    name: 'Tart trái cây',
    categorySlug: 'banh-ngot',
    shortDescription: 'Đế giòn, kem patissiere, trái cây tươi',
    description: 'Tart trái cây theo mùa, bán theo phần.',
    price: '65000',
    status: ProductStatus.PUBLISHED,
    images: [
      {
        url: '/uploads/products/banh-ngot/tart-trai-cay/cover.jpg',
        alt: 'Tart trái cây',
        isCover: true,
      },
    ],
    variants: [
      {
        sku: 'SWEET-002-1',
        size: '1 phần',
        style: 'Tròn',
        price: '65000',
      },
    ],
  },
  {
    sku: 'BREAD-001',
    slug: 'banh-mi-bo-toi',
    name: 'Bánh mì bơ tỏi',
    categorySlug: 'banh-mi',
    shortDescription: 'Nóng giòn, thơm bơ tỏi',
    description: 'Bánh mì baguette nướng bơ tỏi, bán theo ổ.',
    price: '35000',
    status: ProductStatus.PUBLISHED,
    isBestSeller: true,
    images: [
      {
        url: '/uploads/products/banh-mi/banh-mi-bo-toi/cover.jpg',
        alt: 'Bánh mì bơ tỏi',
        isCover: true,
      },
    ],
    variants: [
      {
        sku: 'BREAD-001-1',
        size: '1 ổ',
        style: 'Baguette',
        price: '35000',
      },
    ],
  },
  {
    sku: 'CAKE-DR-001',
    slug: 'banh-kem-draft-mau',
    name: 'Bánh kem nháp (draft)',
    categorySlug: 'banh-kem',
    shortDescription: 'Sản phẩm nháp để test admin',
    description: 'Không hiện public — status DRAFT.',
    price: '200000',
    status: ProductStatus.DRAFT,
    images: [
      {
        url: '/uploads/products/banh-kem/banh-kem-draft-mau/cover.jpg',
        alt: 'Draft',
        isCover: true,
      },
    ],
    variants: [
      {
        sku: 'CAKE-DR-001-S',
        size: 'S',
        style: 'Tròn',
        price: '200000',
      },
    ],
  },
];

async function upsertCategories(): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  const roots = CATEGORIES.filter((c) => !c.parentSlug);
  const children = CATEGORIES.filter((c) => c.parentSlug);

  for (const item of [...roots, ...children]) {
    const parentId = item.parentSlug
      ? ids.get(item.parentSlug) ?? null
      : null;
    if (item.parentSlug && !parentId) {
      throw new Error(`Thiếu parent category: ${item.parentSlug}`);
    }

    const saved = await prisma.category.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl ?? null,
        status: CategoryStatus.VISIBLE,
        sortOrder: item.sortOrder,
        parentId,
        seoTitle: item.seoTitle ?? item.name,
        seoDescription: item.seoDescription ?? item.description,
        deletedAt: null,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl ?? null,
        status: CategoryStatus.VISIBLE,
        sortOrder: item.sortOrder,
        parentId,
        seoTitle: item.seoTitle ?? item.name,
        seoDescription: item.seoDescription ?? item.description,
      },
    });
    ids.set(item.slug, saved.id);
  }

  return ids;
}

async function upsertProducts(categoryIds: Map<string, string>): Promise<void> {
  for (const item of PRODUCTS) {
    const categoryId = categoryIds.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Thiếu category ${item.categorySlug} cho product ${item.sku}`);
    }

    const product = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        categoryId,
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        price: item.price,
        salePrice: item.salePrice ?? null,
        status: item.status ?? ProductStatus.PUBLISHED,
        isFeatured: item.isFeatured ?? false,
        isBestSeller: item.isBestSeller ?? false,
        seoTitle: item.name,
        seoDescription: item.shortDescription,
        deletedAt: null,
      },
      create: {
        categoryId,
        sku: item.sku,
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        price: item.price,
        salePrice: item.salePrice ?? null,
        status: item.status ?? ProductStatus.PUBLISHED,
        isFeatured: item.isFeatured ?? false,
        isBestSeller: item.isBestSeller ?? false,
        seoTitle: item.name,
        seoDescription: item.shortDescription,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: item.images.map((image, index) => ({
        productId: product.id,
        url: image.url,
        alt: image.alt ?? item.name,
        sortOrder: image.sortOrder ?? index,
        isCover: image.isCover ?? index === 0,
      })),
    });

    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.createMany({
      data: item.variants.map((variant, index) => ({
        productId: product.id,
        sku: variant.sku,
        size: variant.size,
        style: variant.style,
        price: variant.price,
        salePrice: variant.salePrice ?? null,
        status: VariantStatus.ACTIVE,
        sortOrder: variant.sortOrder ?? index,
      })),
    });
  }
}

async function main(): Promise<void> {
  const categoryIds = await upsertCategories();
  await upsertProducts(categoryIds);
  console.log(
    `Mock catalog: ${CATEGORIES.length} categories, ${PRODUCTS.length} products`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
