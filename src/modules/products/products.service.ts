import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { slugify } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CategoryStatus, ProductStatus, Prisma } from '../../generated/prisma/client';
import {
  ProductImageResponseDto,
  ProductResponseDto,
  ProductVariantResponseDto,
} from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  QueryPublicProductDto,
  QueryRelatedProductDto,
} from './dto/query-public-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadsService } from '../uploads/uploads.service';
import { productUploadFolder } from '../uploads/upload-path';
import { normalizeProductImages } from './product-images';
import { normalizeProductVariants } from './product-variants';

const imageSelect = {
  id: true,
  url: true,
  alt: true,
  sortOrder: true,
  isCover: true,
} as const;

const variantSelect = {
  id: true,
  sku: true,
  size: true,
  style: true,
  price: true,
  salePrice: true,
  status: true,
  sortOrder: true,
} as const;

const productSelect = {
  id: true,
  categoryId: true,
  sku: true,
  name: true,
  slug: true,
  shortDescription: true,
  description: true,
  price: true,
  salePrice: true,
  status: true,
  isFeatured: true,
  isBestSeller: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
  images: {
    select: imageSelect,
    orderBy: { sortOrder: 'asc' as const },
  },
  variants: {
    select: variantSelect,
    orderBy: { sortOrder: 'asc' as const },
  },
} as const;

const publicListOrder = [
  { isFeatured: 'desc' as const },
  { createdAt: 'desc' as const },
];

type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  async findAll(query: QueryProductDto): Promise<{
    items: ProductResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.ProductWhereInput = { deletedAt: null };
    if (query.status) {
      where.status = query.status;
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }
    if (query.isBestSeller !== undefined) {
      where.isBestSeller = query.isBestSeller;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        select: productSelect,
        orderBy: publicListOrder,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: items.map((item) => this.toResponse(item)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findPublished(query: QueryPublicProductDto): Promise<{
    items: ProductResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const categoryId = await this.resolvePublicCategoryId(
      query.categoryId,
      query.categorySlug,
    );
    return this.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      categoryId,
      isFeatured: query.isFeatured,
      isBestSeller: query.isBestSeller,
      status: ProductStatus.PUBLISHED,
    });
  }

  async findPublishedBySlug(
    categorySlug: string,
    productSlug: string,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        status: ProductStatus.PUBLISHED,
        slug: productSlug,
        category: {
          slug: categorySlug,
          deletedAt: null,
          status: CategoryStatus.VISIBLE,
        },
      },
      select: productSelect,
    });
    if (!product) {
      throw new NotFoundException();
    }
    return this.toResponse(product);
  }

  async findRelated(
    categorySlug: string,
    productSlug: string,
    query: QueryRelatedProductDto,
  ): Promise<{
    items: ProductResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const current = await this.prisma.product.findFirst({
      where: {
        deletedAt: null,
        status: ProductStatus.PUBLISHED,
        slug: productSlug,
        category: {
          slug: categorySlug,
          deletedAt: null,
          status: CategoryStatus.VISIBLE,
        },
      },
      select: { id: true, categoryId: true },
    });
    if (!current) {
      throw new NotFoundException();
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      status: ProductStatus.PUBLISHED,
      categoryId: current.categoryId,
      id: { not: current.id },
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        select: productSelect,
        orderBy: publicListOrder,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: items.map((item) => this.toResponse(item)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    return this.toResponse(await this.getActive(id));
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    await this.assertCategory(dto.categoryId);
    const price = new Prisma.Decimal(dto.price);
    const salePrice = this.toMoney(dto.salePrice);
    this.assertSalePrice(price, salePrice);
    const images = normalizeProductImages(dto.images ?? []);
    const variants = normalizeProductVariants(dto.variants ?? []);

    try {
      const product = await this.prisma.product.create({
        data: {
          categoryId: dto.categoryId,
          sku: dto.sku,
          name: dto.name,
          slug: this.resolveSlug(dto.slug, dto.name),
          shortDescription: dto.shortDescription,
          description: dto.description,
          price,
          salePrice,
          status: dto.status,
          isFeatured: dto.isFeatured,
          isBestSeller: dto.isBestSeller,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          images: { create: images },
          variants: { create: variants },
        },
        select: productSelect,
      });
      return this.toResponse(product);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const current = await this.getActive(id);
    if (dto.categoryId !== undefined) {
      await this.assertCategory(dto.categoryId);
    }
    const price = dto.price ? new Prisma.Decimal(dto.price) : current.price;
    const salePrice =
      dto.salePrice === undefined ? current.salePrice : this.toMoney(dto.salePrice);
    this.assertSalePrice(price, salePrice);
    const images =
      dto.images === undefined ? undefined : normalizeProductImages(dto.images);
    const variants =
      dto.variants === undefined
        ? undefined
        : normalizeProductVariants(dto.variants);

    const data: Prisma.ProductUpdateInput = {};
    if (dto.categoryId !== undefined) {
      data.category = { connect: { id: dto.categoryId } };
    }
    if (dto.sku !== undefined) {
      data.sku = dto.sku;
    }
    if (dto.name !== undefined) {
      data.name = dto.name;
    }
    if (dto.slug !== undefined) {
      data.slug = this.resolveSlug(dto.slug, dto.name ?? current.name);
    }
    if (dto.shortDescription !== undefined) {
      data.shortDescription = dto.shortDescription;
    }
    if (dto.description !== undefined) {
      data.description = dto.description;
    }
    if (dto.price !== undefined) {
      data.price = price;
    }
    if (dto.salePrice !== undefined) {
      data.salePrice = salePrice;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }
    if (dto.isFeatured !== undefined) {
      data.isFeatured = dto.isFeatured;
    }
    if (dto.isBestSeller !== undefined) {
      data.isBestSeller = dto.isBestSeller;
    }
    if (dto.seoTitle !== undefined) {
      data.seoTitle = dto.seoTitle;
    }
    if (dto.seoDescription !== undefined) {
      data.seoDescription = dto.seoDescription;
    }

    const previousUrls = current.images.map((image) => image.url);
    const previousFolder = productUploadFolder(
      current.category.slug,
      current.slug,
    );

    try {
      const product = await this.prisma.$transaction(async (tx) => {
        if (Object.keys(data).length > 0) {
          await tx.product.update({ where: { id }, data });
        }
        if (images) {
          await tx.productImage.deleteMany({ where: { productId: id } });
          if (images.length > 0) {
            await tx.productImage.createMany({
              data: images.map((image) => ({ productId: id, ...image })),
            });
          }
        }
        if (variants) {
          await tx.productVariant.deleteMany({ where: { productId: id } });
          if (variants.length > 0) {
            await tx.productVariant.createMany({
              data: variants.map((variant) => ({ productId: id, ...variant })),
            });
          }
        }
        return tx.product.findFirstOrThrow({
          where: { id },
          select: productSelect,
        });
      });

      const nextFolder = productUploadFolder(
        product.category.slug,
        product.slug,
      );
      if (previousFolder !== nextFolder) {
        await this.uploadsService.removeFolder(previousFolder);
      } else if (images) {
        await this.uploadsService.removeUnusedImageUrls(
          previousUrls,
          images.map((image) => image.url),
        );
      }

      return this.toResponse(product);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    const current = await this.getActive(id);
    await this.prisma.$transaction(async (tx) => {
      const variants = await tx.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      for (const variant of variants) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { sku: `deleted.${variant.id}` },
        });
      }
      await tx.product.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          slug: `deleted.${id}`,
          sku: `deleted.${id}`,
        },
      });
    });
    await this.uploadsService.removeFolder(
      productUploadFolder(current.category.slug, current.slug),
    );
    return { id };
  }

  private async getActive(id: string): Promise<ProductRecord> {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      select: productSelect,
    });
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  private async assertCategory(categoryId: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException();
    }
  }

  private async resolvePublicCategoryId(
    categoryId?: string,
    categorySlug?: string,
  ): Promise<string | undefined> {
    if (!categoryId && !categorySlug) {
      return undefined;
    }
    const category = await this.prisma.category.findFirst({
      where: {
        deletedAt: null,
        status: CategoryStatus.VISIBLE,
        ...(categoryId ? { id: categoryId } : {}),
        ...(categorySlug ? { slug: categorySlug } : {}),
      },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException();
    }
    return category.id;
  }

  private toMoney(value: string | null | undefined): Prisma.Decimal | null {
    if (value === undefined || value === null) {
      return null;
    }
    return new Prisma.Decimal(value);
  }

  private assertSalePrice(
    price: Prisma.Decimal,
    salePrice: Prisma.Decimal | null,
  ): void {
    if (salePrice && salePrice.gte(price)) {
      throw new BadRequestException(MESSAGES.INVALID_SALE_PRICE);
    }
  }

  private resolveSlug(slug: string | undefined, name: string): string {
    const resolved = slug && slug.length > 0 ? slug : slugify(name);
    if (!resolved) {
      throw new BadRequestException('Slug không hợp lệ');
    }
    return resolved;
  }

  private toResponse(product: ProductRecord): ProductResponseDto {
    return {
      id: product.id,
      categoryId: product.categoryId,
      categorySlug: product.category.slug,
      categoryName: product.category.name,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price.toFixed(2),
      salePrice: product.salePrice ? product.salePrice.toFixed(2) : null,
      status: product.status,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      images: product.images.map(
        (image): ProductImageResponseDto => ({
          id: image.id,
          url: image.url,
          alt: image.alt,
          sortOrder: image.sortOrder,
          isCover: image.isCover,
        }),
      ),
      variants: product.variants.map(
        (variant): ProductVariantResponseDto => ({
          id: variant.id,
          sku: variant.sku,
          size: variant.size,
          style: variant.style,
          price: variant.price.toFixed(2),
          salePrice: variant.salePrice ? variant.salePrice.toFixed(2) : null,
          status: variant.status,
          sortOrder: variant.sortOrder,
        }),
      ),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private rethrowUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const raw = `${JSON.stringify(error.meta ?? {})} ${error.message}`;
      if (raw.includes('sku')) {
        throw new ConflictException(MESSAGES.SKU_IN_USE);
      }
      throw new ConflictException(MESSAGES.SLUG_IN_USE);
    }
    throw error;
  }
}