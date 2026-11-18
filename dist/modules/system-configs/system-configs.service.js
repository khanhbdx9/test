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
exports.SystemConfigsService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const configSelect = {
    id: true,
    key: true,
    value: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};
let SystemConfigsService = class SystemConfigsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {};
        if (query.search) {
            where.OR = [
                { key: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [total, items] = await this.prisma.$transaction([
            this.prisma.systemConfig.count({ where }),
            this.prisma.systemConfig.findMany({
                where,
                select: configSelect,
                orderBy: { key: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return { items, pagination: (0, pagination_util_1.buildPagination)(page, limit, total) };
    }
    async findOne(id) {
        return this.getById(id);
    }
    async findValueByKey(key) {
        const row = await this.prisma.systemConfig.findUnique({
            where: { key },
            select: { value: true },
        });
        const value = row?.value?.trim();
        return value ? value : null;
    }
    async create(dto) {
        try {
            return await this.prisma.systemConfig.create({
                data: {
                    key: dto.key,
                    value: dto.value,
                    description: dto.description ?? null,
                },
                select: configSelect,
            });
        }
        catch (error) {
            this.rethrowUnique(error);
        }
    }
    async update(id, dto) {
        await this.getById(id);
        return this.prisma.systemConfig.update({
            where: { id },
            data: {
                value: dto.value,
                description: dto.description === undefined ? undefined : dto.description,
            },
            select: configSelect,
        });
    }
    async remove(id) {
        await this.getById(id);
        await this.prisma.systemConfig.delete({ where: { id } });
        return { id };
    }
    async getById(id) {
        const row = await this.prisma.systemConfig.findUnique({
            where: { id },
            select: configSelect,
        });
        if (!row) {
            throw new common_1.NotFoundException(messages_1.MESSAGES.NOT_FOUND);
        }
        return row;
    }
    rethrowUnique(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException(messages_1.MESSAGES.CONFIG_KEY_IN_USE);
        }
        throw error;
    }
};
exports.SystemConfigsService = SystemConfigsService;
exports.SystemConfigsService = SystemConfigsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemConfigsService);
//# sourceMappingURL=system-configs.service.js.map