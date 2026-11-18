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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const slug_util_1 = require("../../common/utils/slug.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const authorSelect = {
    id: true,
    fullName: true,
};
let PostsService = class PostsService {
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
        if (query.showOnLanding !== undefined) {
            where.showOnLanding = query.showOnLanding;
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { slug: { contains: query.search, mode: 'insensitive' } },
                { excerpt: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.post.count({ where }),
            this.prisma.post.findMany({
                where,
                include: { author: { select: authorSelect } },
                orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            items: rows.map((row) => this.toResponse(row)),
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findPublished(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sortCreated = query.sortCreated ?? 'desc';
        const landing = query.landing ?? false;
        const where = {
            deletedAt: null,
            status: client_1.PostStatus.PUBLISHED,
        };
        if (landing) {
            where.showOnLanding = true;
        }
        if (query.search) {
            where.title = { contains: query.search, mode: 'insensitive' };
        }
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.post.count({ where }),
            this.prisma.post.findMany({
                where,
                include: { author: { select: authorSelect } },
                orderBy: { createdAt: sortCreated },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            items: rows.map((row) => this.toResponse(row)),
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findOne(id) {
        return this.toResponse(await this.getActive(id));
    }
    async findPublishedBySlug(slug) {
        const post = await this.prisma.post.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: client_1.PostStatus.PUBLISHED,
            },
            include: { author: { select: authorSelect } },
        });
        if (!post) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.POST_NOT_FOUND);
        }
        return this.toResponse(post);
    }
    async findRelated(slug, query) {
        const current = await this.prisma.post.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: client_1.PostStatus.PUBLISHED,
            },
            select: { id: true, title: true },
        });
        if (!current) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.POST_NOT_FOUND);
        }
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const keywords = this.extractTitleKeywords(current.title);
        const where = {
            deletedAt: null,
            status: client_1.PostStatus.PUBLISHED,
            id: { not: current.id },
            ...(keywords.length > 0
                ? {
                    OR: keywords.map((word) => ({
                        title: { contains: word, mode: 'insensitive' },
                    })),
                }
                : {}),
        };
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.post.count({ where }),
            this.prisma.post.findMany({
                where,
                include: { author: { select: authorSelect } },
                orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        if (total === 0 && keywords.length > 0) {
            const fallbackWhere = {
                deletedAt: null,
                status: client_1.PostStatus.PUBLISHED,
                id: { not: current.id },
            };
            const [fallbackTotal, fallbackRows] = await this.prisma.$transaction([
                this.prisma.post.count({ where: fallbackWhere }),
                this.prisma.post.findMany({
                    where: fallbackWhere,
                    include: { author: { select: authorSelect } },
                    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
                    skip: (page - 1) * limit,
                    take: limit,
                }),
            ]);
            return {
                items: fallbackRows.map((row) => this.toResponse(row)),
                pagination: (0, pagination_util_1.buildPagination)(page, limit, fallbackTotal),
            };
        }
        return {
            items: rows.map((row) => this.toResponse(row)),
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    extractTitleKeywords(title) {
        const stopWords = new Set([
            'va',
            'và',
            'cua',
            'của',
            'cho',
            'voi',
            'với',
            'cac',
            'các',
            'mot',
            'một',
            'nhung',
            'những',
            'the',
            'and',
            'for',
            'with',
        ]);
        return title
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .map((word) => word.trim())
            .filter((word) => word.length >= 3 && !stopWords.has(word))
            .slice(0, 5);
    }
    async create(authorId, dto) {
        const slug = this.resolveSlug(dto.slug, dto.title);
        const status = dto.status ?? client_1.PostStatus.DRAFT;
        try {
            const post = await this.prisma.post.create({
                data: {
                    authorId,
                    title: dto.title,
                    slug,
                    thumbnailUrl: dto.thumbnailUrl ?? null,
                    content: dto.content,
                    excerpt: dto.excerpt ?? null,
                    status,
                    showOnLanding: dto.showOnLanding ?? false,
                    publishedAt: status === client_1.PostStatus.PUBLISHED ? new Date() : null,
                    seoTitle: dto.seoTitle ?? null,
                    seoDescription: dto.seoDescription ?? null,
                },
                include: { author: { select: authorSelect } },
            });
            return this.toResponse(post);
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async update(id, dto) {
        const current = await this.getActive(id);
        const nextStatus = dto.status ?? current.status;
        const slug = dto.slug !== undefined || dto.title !== undefined
            ? this.resolveSlug(dto.slug, dto.title ?? current.title)
            : undefined;
        try {
            const post = await this.prisma.post.update({
                where: { id },
                data: {
                    title: dto.title,
                    slug,
                    thumbnailUrl: dto.thumbnailUrl,
                    content: dto.content,
                    excerpt: dto.excerpt,
                    status: dto.status,
                    showOnLanding: dto.showOnLanding,
                    publishedAt: nextStatus === client_1.PostStatus.PUBLISHED
                        ? (current.publishedAt ?? new Date())
                        : dto.status === client_1.PostStatus.DRAFT
                            ? null
                            : undefined,
                    seoTitle: dto.seoTitle,
                    seoDescription: dto.seoDescription,
                },
                include: { author: { select: authorSelect } },
            });
            return this.toResponse(post);
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async publish(id) {
        await this.getActive(id);
        const post = await this.prisma.post.update({
            where: { id },
            data: {
                status: client_1.PostStatus.PUBLISHED,
                publishedAt: new Date(),
            },
            include: { author: { select: authorSelect } },
        });
        return this.toResponse(post);
    }
    async remove(id) {
        await this.getActive(id);
        await this.prisma.post.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                slug: `deleted.${id}`,
                status: client_1.PostStatus.DRAFT,
                publishedAt: null,
            },
        });
        return { id };
    }
    async getActive(id) {
        const post = await this.prisma.post.findFirst({
            where: { id, deletedAt: null },
            include: { author: { select: authorSelect } },
        });
        if (!post) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.POST_NOT_FOUND);
        }
        return post;
    }
    resolveSlug(slug, title) {
        return (slug?.trim() || (0, slug_util_1.slugify)(title)).toLowerCase();
    }
    toResponse(post) {
        return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            thumbnailUrl: post.thumbnailUrl,
            content: post.content,
            excerpt: post.excerpt,
            status: post.status,
            showOnLanding: post.showOnLanding,
            publishedAt: post.publishedAt,
            seoTitle: post.seoTitle,
            seoDescription: post.seoDescription,
            author: post.author,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
    rethrowUnique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException(messages_1.MESSAGES.POST_SLUG_IN_USE);
        }
        throw error;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map