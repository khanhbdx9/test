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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let BannersService = class BannersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {};
        if (query.position) {
            where.position = query.position;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.search) {
            where.title = { contains: query.search, mode: 'insensitive' };
        }
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.banner.count({ where }),
            this.prisma.banner.findMany({
                where,
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            items: rows.map((row) => this.toResponse(row)),
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findActive(query) {
        const now = new Date();
        const where = {
            isActive: true,
            AND: [
                { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
                { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
            ],
        };
        if (query.position) {
            where.position = query.position;
        }
        const rows = await this.prisma.banner.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        return rows.map((row) => this.toResponse(row));
    }
    async findOne(id) {
        return this.toResponse(await this.getBanner(id));
    }
    async create(dto) {
        const banner = await this.prisma.banner.create({
            data: {
                title: dto.title,
                desktopImageUrl: dto.desktopImageUrl,
                mobileImageUrl: dto.mobileImageUrl ?? null,
                link: dto.link ?? null,
                position: dto.position,
                sortOrder: dto.sortOrder ?? 0,
                startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
                endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
                isActive: dto.isActive ?? true,
            },
        });
        return this.toResponse(banner);
    }
    async update(id, dto) {
        await this.getBanner(id);
        const banner = await this.prisma.banner.update({
            where: { id },
            data: {
                title: dto.title,
                desktopImageUrl: dto.desktopImageUrl,
                mobileImageUrl: dto.mobileImageUrl,
                link: dto.link,
                position: dto.position,
                sortOrder: dto.sortOrder,
                startsAt: dto.startsAt === undefined
                    ? undefined
                    : dto.startsAt
                        ? new Date(dto.startsAt)
                        : null,
                endsAt: dto.endsAt === undefined
                    ? undefined
                    : dto.endsAt
                        ? new Date(dto.endsAt)
                        : null,
                isActive: dto.isActive,
            },
        });
        return this.toResponse(banner);
    }
    async remove(id) {
        await this.getBanner(id);
        await this.prisma.banner.delete({ where: { id } });
        return { id };
    }
    async getBanner(id) {
        const banner = await this.prisma.banner.findUnique({ where: { id } });
        if (!banner) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.BANNER_NOT_FOUND);
        }
        return banner;
    }
    toResponse(banner) {
        return {
            id: banner.id,
            title: banner.title,
            desktopImageUrl: banner.desktopImageUrl,
            mobileImageUrl: banner.mobileImageUrl,
            link: banner.link,
            position: banner.position,
            sortOrder: banner.sortOrder,
            startsAt: banner.startsAt,
            endsAt: banner.endsAt,
            isActive: banner.isActive,
            createdAt: banner.createdAt,
            updatedAt: banner.updatedAt,
        };
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannersService);
//# sourceMappingURL=banners.service.js.map