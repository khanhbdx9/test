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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const access_policy_1 = require("../auth/access.policy");
const permissionSelect = {
    id: true,
    code: true,
    module: true,
    action: true,
    description: true,
};
const roleSelect = {
    id: true,
    code: true,
    name: true,
    description: true,
    isSystem: true,
    createdAt: true,
    updatedAt: true,
};
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = query.search
            ? {
                OR: [
                    { code: { contains: query.search, mode: 'insensitive' } },
                    { name: { contains: query.search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [total, roles] = await this.prisma.$transaction([
            this.prisma.role.count({ where }),
            this.prisma.role.findMany({
                where,
                select: roleSelect,
                orderBy: { createdAt: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return { items: roles, pagination: (0, pagination_util_1.buildPagination)(page, limit, total) };
    }
    async findOne(id) {
        const role = await this.getRole(id);
        return this.toDetail(role);
    }
    async create(actor, dto) {
        const permissions = await this.resolvePermissions(dto.permissionIds ?? []);
        (0, access_policy_1.assertCanGrant)(actor, permissions.map((permission) => permission.code));
        try {
            const role = await this.prisma.role.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    description: dto.description,
                    isSystem: false,
                    permissions: {
                        create: permissions.map((permission) => ({
                            permissionId: permission.id,
                        })),
                    },
                },
                select: {
                    ...roleSelect,
                    permissions: { select: { permission: { select: permissionSelect } } },
                },
            });
            return this.toDetail(role);
        }
        catch (error) {
            this.rethrowCodeConflict(error);
        }
    }
    async update(id, dto) {
        const role = await this.getRole(id);
        this.assertMutable(role.isSystem);
        const data = {};
        if (dto.code !== undefined) {
            data.code = dto.code;
        }
        if (dto.name !== undefined) {
            data.name = dto.name;
        }
        if (dto.description !== undefined) {
            data.description = dto.description;
        }
        if (Object.keys(data).length === 0) {
            return {
                id: role.id,
                code: role.code,
                name: role.name,
                description: role.description,
                isSystem: role.isSystem,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
            };
        }
        try {
            return await this.prisma.role.update({
                where: { id },
                data,
                select: roleSelect,
            });
        }
        catch (error) {
            this.rethrowCodeConflict(error);
        }
    }
    async remove(id) {
        const role = await this.getRole(id);
        this.assertMutable(role.isSystem);
        const used = await this.prisma.user.count({ where: { roleId: id } });
        if (used > 0) {
            throw new common_1.ConflictException(messages_1.MESSAGES.ROLE_IN_USE);
        }
        await this.prisma.role.delete({ where: { id } });
        return { id };
    }
    async listPermissions(id) {
        const role = await this.getRole(id);
        return { permissions: this.mapPermissions(role) };
    }
    async replacePermissions(actor, id, dto) {
        const role = await this.getRole(id);
        this.assertMutable(role.isSystem);
        const permissions = await this.resolvePermissions(dto.permissionIds);
        (0, access_policy_1.assertCanGrant)(actor, permissions.map((permission) => permission.code));
        await this.prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({ where: { roleId: id } });
            if (permissions.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissions.map((permission) => ({
                        roleId: id,
                        permissionId: permission.id,
                    })),
                });
            }
        });
        return { permissions };
    }
    async getRole(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            select: {
                ...roleSelect,
                permissions: { select: { permission: { select: permissionSelect } } },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException();
        }
        return role;
    }
    async resolvePermissions(permissionIds) {
        const uniqueIds = [...new Set(permissionIds)];
        if (uniqueIds.length === 0) {
            return [];
        }
        const permissions = await this.prisma.permission.findMany({
            where: { id: { in: uniqueIds } },
            select: permissionSelect,
        });
        if (permissions.length !== uniqueIds.length) {
            throw new common_1.NotFoundException('Không tìm thấy quyền');
        }
        return permissions;
    }
    assertMutable(isSystem) {
        if (isSystem) {
            throw new common_1.ForbiddenException(messages_1.MESSAGES.SYSTEM_ROLE_PROTECTED);
        }
    }
    mapPermissions(role) {
        return role.permissions.map((item) => item.permission);
    }
    toDetail(role) {
        return {
            id: role.id,
            code: role.code,
            name: role.name,
            description: role.description,
            isSystem: role.isSystem,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
            permissions: this.mapPermissions(role),
        };
    }
    rethrowCodeConflict(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Mã role đã tồn tại');
        }
        throw error;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map