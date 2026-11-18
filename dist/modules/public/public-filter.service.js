"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicFilterService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
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
        orderBy: { sortOrder: 'asc' },
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
        orderBy: { sortOrder: 'asc' },
    },
};
let PublicFilterService = class PublicFilterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async filter(dto) {
        const search = dto.search?.trim() || null;
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 12;
        const categoryId = await this.resolveCategoryId(dto.categoryId);
        const andFilters = [];
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
        const productWhere = {
            deletedAt: null,
            status: client_1.ProductStatus.PUBLISHED,
            category: {
                deletedAt: null,
                status: client_1.CategoryStatus.VISIBLE,
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
                        status: client_1.CategoryStatus.VISIBLE,
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
                        status: client_1.PostStatus.PUBLISHED,
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
        const categoryItems = categories.map((row) => ({
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
        }));
        const postItems = posts.map((row) => ({
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
        }));
        return {
            search,
            products: productItems,
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
            categories: categoryItems,
            posts: postItems,
            suggestions: this.buildSuggestions(productItems, categoryItems, postItems),
        };
    }
    async resolveCategoryId(categoryId) {
        if (!categoryId) {
            return undefined;
        }
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                deletedAt: null,
                status: client_1.CategoryStatus.VISIBLE,
            },
            select: { id: true },
        });
        return category?.id;
    }
    buildPriceFilter(minPrice, maxPrice) {
        if (minPrice === undefined && maxPrice === undefined) {
            return null;
        }
        if (minPrice !== undefined &&
            maxPrice !== undefined &&
            minPrice > maxPrice) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.VALIDATION_ERROR);
        }
        const effectivePrice = {};
        if (minPrice !== undefined) {
            effectivePrice.gte = new client_1.Prisma.Decimal(minPrice);
        }
        if (maxPrice !== undefined) {
            effectivePrice.lte = new client_1.Prisma.Decimal(maxPrice);
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
    resolveOrder(sortBy = 'createdAt', sort = 'desc') {
        return [{ [sortBy]: sort }];
    }
    buildSuggestions(products, categories, posts) {
        const suggestions = [];
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
    toProduct(product) {
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
            images: product.images.map((image) => ({
                id: image.id,
                url: image.url,
                alt: image.alt,
                sortOrder: image.sortOrder,
                isCover: image.isCover,
            })),
            variants: product.variants.map((variant) => ({
                id: variant.id,
                sku: variant.sku,
                size: variant.size,
                style: variant.style,
                price: variant.price.toFixed(2),
                salePrice: variant.salePrice ? variant.salePrice.toFixed(2) : null,
                status: variant.status,
                sortOrder: variant.sortOrder,
            })),
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
};
exports.PublicFilterService = PublicFilterService;
exports.PublicFilterService = PublicFilterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicFilterService);
//# sourceMappingURL=public-filter.service.js.map