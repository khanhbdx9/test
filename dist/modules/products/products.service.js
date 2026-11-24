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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const slug_util_1 = require("../../common/utils/slug.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const uploads_service_1 = require("../uploads/uploads.service");
const upload_path_1 = require("../uploads/upload-path");
const product_images_1 = require("./product-images");
const product_variants_1 = require("./product-variants");
const imageSelect = {
    id: true,
    url: true,
    alt: true,
    sortOrder: true,
    isCover: true,
};
const variantSelect = {
    id: true,
    sku: true,
    size: true,
    style: true,
    price: true,
    salePrice: true,
    status: true,
    sortOrder: true,
};
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
        orderBy: { sortOrder: 'asc' },
    },
    variants: {
        select: variantSelect,
        orderBy: { sortOrder: 'asc' },
    },
};
const publicListOrder = [
    { isFeatured: 'desc' },
    { createdAt: 'desc' },
];
let ProductsService = class ProductsService {
    prisma;
    uploadsService;
    constructor(prisma, uploadsService) {
        this.prisma = prisma;
        this.uploadsService = uploadsService;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = { deletedAt: null };
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
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findPublished(query) {
        const categoryId = await this.resolvePublicCategoryId(query.categoryId, query.categorySlug);
        return this.findAll({
            page: query.page,
            limit: query.limit,
            search: query.search,
            categoryId,
            isFeatured: query.isFeatured,
            isBestSeller: query.isBestSeller,
            status: client_1.ProductStatus.PUBLISHED,
        });
    }
    async findPublishedByCategory(categorySlug, query) {
        const resolvedCategoryId = await this.resolvePublicCategoryId(undefined, categorySlug);
        return this.findAll({
            page: query.page,
            limit: query.limit,
            search: query.search,
            categoryId: resolvedCategoryId,
            status: client_1.ProductStatus.PUBLISHED,
        });
    }
    async findPublishedBySlug(categorySlug, productSlug) {
        const product = await this.prisma.product.findFirst({
            where: {
                deletedAt: null,
                status: client_1.ProductStatus.PUBLISHED,
                slug: productSlug,
                category: {
                    slug: categorySlug,
                    deletedAt: null,
                    status: client_1.CategoryStatus.VISIBLE,
                },
            },
            select: productSelect,
        });
        if (!product) {
            throw new common_1.NotFoundException();
        }
        return this.toResponse(product);
    }
    async findRelated(categorySlug, productSlug, query) {
        const current = await this.getPublishedProductRef(categorySlug, productSlug);
        return this.findRelatedSameCategory(current, query);
    }
    async findRelatedOtherCategories(categorySlug) {
        await this.resolvePublicCategoryId(undefined, categorySlug);
        const products = await this.prisma.product.findMany({
            where: {
                deletedAt: null,
                status: client_1.ProductStatus.PUBLISHED,
                category: {
                    deletedAt: null,
                    status: client_1.CategoryStatus.VISIBLE,
                    slug: { not: categorySlug },
                },
            },
            select: productSelect,
            orderBy: publicListOrder,
        });
        const byCategory = new Map();
        for (const product of products) {
            const list = byCategory.get(product.categoryId);
            if (list) {
                list.push(product);
            }
            else {
                byCategory.set(product.categoryId, [product]);
            }
        }
        const max = 10;
        const groups = [...byCategory.values()];
        const selected = [];
        let round = 0;
        while (selected.length < max) {
            let addedInRound = false;
            for (const group of groups) {
                if (round < group.length) {
                    selected.push(group[round]);
                    addedInRound = true;
                    if (selected.length >= max) {
                        break;
                    }
                }
            }
            if (!addedInRound) {
                break;
            }
            round += 1;
        }
        return {
            items: selected.map((item) => this.toResponse(item)),
            pagination: (0, pagination_util_1.buildPagination)(1, max, selected.length),
        };
    }
    async findOne(id) {
        return this.toResponse(await this.getActive(id));
    }
    async create(dto) {
        await this.assertCategory(dto.categoryId);
        const price = new client_1.Prisma.Decimal(dto.price);
        const salePrice = this.toMoney(dto.salePrice);
        this.assertSalePrice(price, salePrice);
        const images = (0, product_images_1.normalizeProductImages)(dto.images ?? []);
        const variants = (0, product_variants_1.normalizeProductVariants)(dto.variants ?? []);
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
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async update(id, dto) {
        const current = await this.getActive(id);
        if (dto.categoryId !== undefined) {
            await this.assertCategory(dto.categoryId);
        }
        const price = dto.price ? new client_1.Prisma.Decimal(dto.price) : current.price;
        const salePrice = dto.salePrice === undefined ? current.salePrice : this.toMoney(dto.salePrice);
        this.assertSalePrice(price, salePrice);
        const images = dto.images === undefined ? undefined : (0, product_images_1.normalizeProductImages)(dto.images);
        const variants = dto.variants === undefined
            ? undefined
            : (0, product_variants_1.normalizeProductVariants)(dto.variants);
        const data = {};
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
        const previousFolder = (0, upload_path_1.productUploadFolder)(current.category.slug, current.slug);
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
            const nextFolder = (0, upload_path_1.productUploadFolder)(product.category.slug, product.slug);
            if (previousFolder !== nextFolder) {
                await this.uploadsService.removeFolder(previousFolder);
            }
            else if (images) {
                await this.uploadsService.removeUnusedImageUrls(previousUrls, images.map((image) => image.url));
            }
            return this.toResponse(product);
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async remove(id) {
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
        await this.uploadsService.removeFolder((0, upload_path_1.productUploadFolder)(current.category.slug, current.slug));
        return { id };
    }
    async getActive(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            select: productSelect,
        });
        if (!product) {
            throw new common_1.NotFoundException();
        }
        return product;
    }
    async assertCategory(categoryId) {
        const category = await this.prisma.category.findFirst({
            where: { id: categoryId, deletedAt: null },
            select: { id: true },
        });
        if (!category) {
            throw new common_1.NotFoundException();
        }
    }
    async resolvePublicCategoryId(categoryId, categorySlug) {
        if (!categoryId && !categorySlug) {
            return undefined;
        }
        const category = await this.prisma.category.findFirst({
            where: {
                deletedAt: null,
                status: client_1.CategoryStatus.VISIBLE,
                ...(categoryId ? { id: categoryId } : {}),
                ...(categorySlug ? { slug: categorySlug } : {}),
            },
            select: { id: true },
        });
        if (!category) {
            throw new common_1.NotFoundException();
        }
        return category.id;
    }
    async getPublishedProductRef(categorySlug, productSlug) {
        const current = await this.prisma.product.findFirst({
            where: {
                deletedAt: null,
                status: client_1.ProductStatus.PUBLISHED,
                slug: productSlug,
                category: {
                    slug: categorySlug,
                    deletedAt: null,
                    status: client_1.CategoryStatus.VISIBLE,
                },
            },
            select: { id: true, categoryId: true },
        });
        if (!current) {
            throw new common_1.NotFoundException();
        }
        return current;
    }
    async findRelatedSameCategory(current, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {
            deletedAt: null,
            status: client_1.ProductStatus.PUBLISHED,
            id: { not: current.id },
            categoryId: current.categoryId,
            category: {
                deletedAt: null,
                status: client_1.CategoryStatus.VISIBLE,
            },
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
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    toMoney(value) {
        if (value === undefined || value === null) {
            return null;
        }
        return new client_1.Prisma.Decimal(value);
    }
    assertSalePrice(price, salePrice) {
        if (salePrice && salePrice.gte(price)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_SALE_PRICE);
        }
    }
    resolveSlug(slug, name) {
        const resolved = slug && slug.length > 0 ? slug : (0, slug_util_1.slugify)(name);
        if (!resolved) {
            throw new common_1.BadRequestException('Slug không hợp lệ');
        }
        return resolved;
    }
    toResponse(product) {
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
    rethrowUnique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            const raw = `${JSON.stringify(error.meta ?? {})} ${error.message}`;
            if (raw.includes('sku')) {
                throw new common_1.ConflictException(messages_1.MESSAGES.SKU_IN_USE);
            }
            throw new common_1.ConflictException(messages_1.MESSAGES.SLUG_IN_USE);
        }
        throw error;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map