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
exports.ThemesService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
let ThemesService = class ThemesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {};
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { code: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [total, rows] = await this.prisma.$transaction([
            this.prisma.theme.count({ where }),
            this.prisma.theme.findMany({
                where,
                orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
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
        return this.toResponse(await this.getTheme(id));
    }
    async findActive() {
        const theme = await this.prisma.theme.findFirst({
            where: { isActive: true },
        });
        return theme ? this.toResponse(theme) : null;
    }
    async create(dto) {
        try {
            const theme = await this.prisma.$transaction(async (tx) => {
                if (dto.isActive) {
                    await tx.theme.updateMany({
                        where: { isActive: true },
                        data: { isActive: false },
                    });
                }
                return tx.theme.create({
                    data: {
                        name: dto.name,
                        code: dto.code,
                        description: dto.description ?? null,
                        config: dto.config,
                        previewUrl: dto.previewUrl ?? null,
                        isActive: dto.isActive ?? false,
                    },
                });
            });
            return this.toResponse(theme);
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async update(id, dto) {
        await this.getTheme(id);
        try {
            const theme = await this.prisma.$transaction(async (tx) => {
                if (dto.isActive === true) {
                    await tx.theme.updateMany({
                        where: { isActive: true, NOT: { id } },
                        data: { isActive: false },
                    });
                }
                return tx.theme.update({
                    where: { id },
                    data: {
                        name: dto.name,
                        code: dto.code,
                        description: dto.description,
                        config: dto.config === undefined
                            ? undefined
                            : dto.config,
                        previewUrl: dto.previewUrl,
                        isActive: dto.isActive,
                    },
                });
            });
            return this.toResponse(theme);
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async remove(id) {
        await this.getTheme(id);
        await this.prisma.theme.delete({ where: { id } });
        return { id };
    }
    async getTheme(id) {
        const theme = await this.prisma.theme.findUnique({ where: { id } });
        if (!theme) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.THEME_NOT_FOUND);
        }
        return theme;
    }
    toResponse(theme) {
        return {
            id: theme.id,
            name: theme.name,
            code: theme.code,
            description: theme.description,
            config: (theme.config ?? {}),
            previewUrl: theme.previewUrl,
            isActive: theme.isActive,
            createdAt: theme.createdAt,
            updatedAt: theme.updatedAt,
        };
    }
    rethrowUnique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException(messages_1.MESSAGES.THEME_CODE_IN_USE);
        }
        throw error;
    }
};
exports.ThemesService = ThemesService;
exports.ThemesService = ThemesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ThemesService);
//# sourceMappingURL=themes.service.js.map