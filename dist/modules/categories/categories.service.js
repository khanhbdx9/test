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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const slug_util_1 = require("../../common/utils/slug.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const categorySelect = {
    id: true,
    parentId: true,
    name: true,
    slug: true,
    description: true,
    imageUrl: true,
    status: true,
    sortOrder: true,
    seoTitle: true,
    seoDescription: true,
    createdAt: true,
    updatedAt: true,
};
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = { deletedAt: null };
        if (query.status) {
            where.status = query.status;
        }
        if (query.parentId) {
            where.parentId = query.parentId;
        }
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { slug: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [total, items] = await this.prisma.$transaction([
            this.prisma.category.count({ where }),
            this.prisma.category.findMany({
                where,
                select: categorySelect,
                orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return { items, pagination: (0, pagination_util_1.buildPagination)(page, limit, total) };
    }
    findVisible(query) {
        return this.findAll({ ...query, status: client_1.CategoryStatus.VISIBLE });
    }
    async findVisibleOne(id) {
        const category = await this.prisma.category.findFirst({
            where: { id, deletedAt: null, status: client_1.CategoryStatus.VISIBLE },
            select: categorySelect,
        });
        if (!category) {
            throw new common_1.NotFoundException();
        }
        return category;
    }
    async findOne(id) {
        return this.getActive(id);
    }
    async create(dto) {
        await this.assertParent(dto.parentId);
        const slug = this.resolveSlug(dto.slug, dto.name);
        try {
            return await this.prisma.category.create({
                data: {
                    name: dto.name,
                    slug,
                    description: dto.description,
                    imageUrl: dto.imageUrl,
                    status: dto.status,
                    sortOrder: dto.sortOrder,
                    seoTitle: dto.seoTitle,
                    seoDescription: dto.seoDescription,
                    parentId: dto.parentId,
                },
                select: categorySelect,
            });
        }
        catch (error) {
            this.rethrowSlugConflict(error);
        }
    }
    async update(id, dto) {
        const current = await this.getActive(id);
        if (dto.parentId !== undefined) {
            await this.assertParent(dto.parentId, id);
        }
        const data = {};
        if (dto.name !== undefined) {
            data.name = dto.name;
        }
        if (dto.slug !== undefined) {
            data.slug = this.resolveSlug(dto.slug, dto.name ?? current.name);
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (dto.imageUrl !== undefined) {
            data.imageUrl = dto.imageUrl;
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        if (dto.sortOrder !== undefined) {
            data.sortOrder = dto.sortOrder;
        }
        if (dto.seoTitle !== undefined) {
            data.seoTitle = dto.seoTitle;
        }
        if (dto.seoDescription !== undefined) {
            data.seoDescription = dto.seoDescription;
        }
        if (dto.parentId !== undefined) {
            data.parent = dto.parentId
                ? { connect: { id: dto.parentId } }
                : { disconnect: true };
        }
        if (Object.keys(data).length === 0) {
            return current;
        }
        try {
            return await this.prisma.category.update({
                where: { id },
                data,
                select: categorySelect,
            });
        }
        catch (error) {
            this.rethrowSlugConflict(error);
        }
    }
    async remove(id) {
        await this.getActive(id);
        const children = await this.prisma.category.count({
            where: { parentId: id, deletedAt: null },
        });
        if (children > 0) {
            throw new common_1.ConflictException(messages_1.MESSAGES.CATEGORY_HAS_CHILDREN);
        }
        await this.prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                slug: `deleted.${id}`,
            },
        });
        return { id };
    }
    async getActive(id) {
        const category = await this.prisma.category.findFirst({
            where: { id, deletedAt: null },
            select: categorySelect,
        });
        if (!category) {
            throw new common_1.NotFoundException();
        }
        return category;
    }
    async assertParent(parentId, categoryId) {
        if (!parentId) {
            return;
        }
        const seen = new Set();
        let current = parentId;
        while (current) {
            if (current === categoryId || seen.has(current)) {
                throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_PARENT);
            }
            seen.add(current);
            const parent = await this.prisma.category.findFirst({
                where: { id: current, deletedAt: null },
                select: { parentId: true },
            });
            if (!parent) {
                throw new common_1.NotFoundException();
            }
            current = parent.parentId;
        }
    }
    resolveSlug(slug, name) {
        const resolved = slug && slug.length > 0 ? slug : (0, slug_util_1.slugify)(name);
        if (!resolved) {
            throw new common_1.BadRequestException('Slug không hợp lệ');
        }
        return resolved;
    }
    rethrowSlugConflict(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException(messages_1.MESSAGES.SLUG_IN_USE);
        }
        throw error;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map