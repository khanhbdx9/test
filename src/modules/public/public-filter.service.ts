import { BadRequestException, Injectable } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  CategoryStatus,
  PostStatus,
  Prisma,
  ProductStatus,
} from '../../generated/prisma/client';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import {
  ProductImageResponseDto,
  ProductResponseDto,
  ProductVariantResponseDto,
} from '../products/dto/product-response.dto';
import {
  PublicFilterDto,
  PublicFilterSortBy,
} from './dto/public-filter.dto';
import {
  PublicFilterResponseDto,
  PublicFilterSuggestionDto,
} from './dto/public-filter-response.dto';

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
    select: {
      id: true,
      url: true,
      alt: true,
      sortOrder: true,
      isCover: true,
    },
    orderBy: { sortOrder: 'asc' as const },
  },
  variants: {
    select: {
      id: true,
      sku: true,
      size: true,
      style: true,
      price: true,
      salePrice: true,
      status: true,
      sortOrder: true,
    },
    orderBy: { sortOrder: 'asc' as const },
  },
} as const;

type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

@Injectable()
export class PublicFilterService {
  constructor(private readonly prisma: PrismaService) {}

  async filter(dto: PublicFilterDto): Promise<PublicFilterResponseDto> {
    const search = dto.search?.trim() || null;
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 12;
    const categoryId = await this.resolveCategoryId(dto.categoryId);

    const andFilters: Prisma.ProductWhereInput[] = [];
    if (search) {
      andFilters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            category: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    const priceFilter = this.buildPriceFilter(dto.minPrice, dto.maxPrice);
    if (priceFilter) {
      andFilters.push(priceFilter);
    }

    const productWhere: Prisma.ProductWhereInput = {
      deletedAt: null,
      status: ProductStatus.PUBLISHED,
      category: {
        deletedAt: null,
        status: CategoryStatus.VISIBLE,
      },
      ...(categoryId ? { categoryId } : {}),
      ...(andFilters.length > 0 ? { AND: andFilters } : {}),
    };

    const [total, products, categories, posts] = await Promise.all([
      this.prisma.product.count({ where: productWhere }),
      this.prisma.product.findMany({
        where: productWhere,
        select: productSelect,
        orderBy: this.resolveOrder(dto.sortBy, dto.sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      search
        ? this.prisma.category.findMany({
            where: {
              deletedAt: null,
              status: CategoryStatus.VISIBLE,
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            take: 8,
          })
        : Promise.resolve([]),
      search
        ? this.prisma.post.findMany({
            where: {
              deletedAt: null,
              status: PostStatus.PUBLISHED,
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
              ],
            },
            include: {
              author: { select: { id: true, fullName: true } },
            },
            orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
            take: 5,
          })
        : Promise.resolve([]),
    ]);

    const productItems = products.map((row) => this.toProduct(row));
    const categoryItems = categories.map(
      (row): CategoryResponseDto => ({
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        slug: row.slug,
        description: row.description,
        imageUrl: row.imageUrl,
        status: row.status,
        sortOrder: row.sortOrder,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    );
    const postItems = posts.map(
      (row): PostResponseDto => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        thumbnailUrl: row.thumbnailUrl,
        content: row.content,
        excerpt: row.excerpt,
        status: row.status,
        showOnLanding: row.showOnLanding,
        publishedAt: row.publishedAt,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        author: row.author,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    );

    return {
      search,
      products: productItems,
      pagination: buildPagination(page, limit, total),
      categories: categoryItems,
      posts: postItems,
      suggestions: this.buildSuggestions(productItems, categoryItems, postItems),
    };
  }

  private async resolveCategoryId(
    categoryId?: string,
  ): Promise<string | undefined> {
    if (!categoryId) {
      return undefined;
    }
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        deletedAt: null,
        status: CategoryStatus.VISIBLE,
      },
      select: { id: true },
    });
    return category?.id;
  }

  private buildPriceFilter(
    minPrice?: number,
    maxPrice?: number,
  ): Prisma.ProductWhereInput | null {
    if (minPrice === undefined && maxPrice === undefined) {
      return null;
    }
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new BadRequestException(MESSAGES.VALIDATION_ERROR);
    }

    const effectivePrice: Prisma.DecimalFilter = {};
    if (minPrice !== undefined) {
      effectivePrice.gte = new Prisma.Decimal(minPrice);
    }
    if (maxPrice !== undefined) {
      effectivePrice.lte = new Prisma.Decimal(maxPrice);
    }

    return {
      OR: [
        {
          AND: [{ salePrice: { not: null } }, { salePrice: effectivePrice }],
        },
        {
          AND: [{ salePrice: null }, { price: effectivePrice }],
        },
      ],
    };
  }

  private resolveOrder(
    sortBy: PublicFilterSortBy = 'createdAt',
    sort: 'asc' | 'desc' = 'desc',
  ): Prisma.ProductOrderByWithRelationInput[] {
    return [{ [sortBy]: sort } as Prisma.ProductOrderByWithRelationInput];
  }

  private buildSuggestions(
    products: ProductResponseDto[],
    categories: CategoryResponseDto[],
    posts: PostResponseDto[],
  ): PublicFilterSuggestionDto[] {
    const suggestions: PublicFilterSuggestionDto[] = [];
    for (const category of categories.slice(0, 3)) {
      suggestions.push({
        type: 'category',
        id: category.id,
        label: category.name,
        slug: category.slug,
      });
    }
    for (const product of products.slice(0, 5)) {
      suggestions.push({
        type: 'product',
        id: product.id,
        label: product.name,
        slug: `${product.categorySlug}/${product.slug}`,
      });
    }
    for (const post of posts.slice(0, 2)) {
      suggestions.push({
        type: 'post',
        id: post.id,
        label: post.title,
        slug: post.slug,
      });
    }
    return suggestions;
  }

  private toProduct(product: ProductRecord): ProductResponseDto {
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
}
