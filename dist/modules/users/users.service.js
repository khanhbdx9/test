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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const system_1 = require("../../common/constants/system");
const pagination_util_1 = require("../../common/utils/pagination.util");
const password_util_1 = require("../../common/utils/password.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const access_policy_1 = require("../auth/access.policy");
const user_mapper_1 = require("./user.mapper");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {
            deletedAt: null,
            ...(query.status ? { status: query.status } : {}),
            ...(query.roleId ? { roleId: query.roleId } : {}),
            ...(query.search
                ? {
                    OR: [
                        { email: { contains: query.search, mode: 'insensitive' } },
                        { fullName: { contains: query.search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const [total, users] = await this.prisma.$transaction([
            this.prisma.user.count({ where }),
            this.prisma.user.findMany({
                where,
                select: user_mapper_1.publicUserSelect,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);
        return {
            items: users.map(user_mapper_1.mapUserResponse),
            pagination: (0, pagination_util_1.buildPagination)(page, limit, total),
        };
    }
    async findOne(id) {
        return (0, user_mapper_1.mapUserResponse)(await this.getActiveUser(id));
    }
    async create(actor, dto) {
        const role = await this.getRoleWithPermissions(dto.roleId);
        (0, access_policy_1.assertCanAssignRole)(actor, role.code, role.permissionCodes);
        await this.assertEmailAvailable(dto.email);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    fullName: dto.fullName,
                    passwordHash: await (0, password_util_1.hashPassword)(dto.password),
                    roleId: role.id,
                },
                select: user_mapper_1.publicUserSelect,
            });
            return (0, user_mapper_1.mapUserResponse)(user);
        }
        catch (error) {
            this.rethrowEmailConflict(error);
        }
    }
    async update(actor, id, dto) {
        const current = await this.getActiveUser(id);
        (0, access_policy_1.assertCanTouchSuperAdmin)(actor, current.role.code);
        const data = {};
        if (dto.fullName !== undefined) {
            data.fullName = dto.fullName;
        }
        if (dto.email !== undefined && dto.email !== current.email) {
            await this.assertEmailAvailable(dto.email);
            data.email = dto.email;
        }
        if (dto.password !== undefined) {
            data.passwordHash = await (0, password_util_1.hashPassword)(dto.password);
        }
        if (Object.keys(data).length === 0) {
            return (0, user_mapper_1.mapUserResponse)(current);
        }
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data,
                select: user_mapper_1.publicUserSelect,
            });
            return (0, user_mapper_1.mapUserResponse)(user);
        }
        catch (error) {
            this.rethrowEmailConflict(error);
        }
    }
    async remove(actor, id) {
        const current = await this.getActiveUser(id);
        if (actor.id === current.id) {
            throw new common_1.ForbiddenException(messages_1.MESSAGES.SELF_DELETE);
        }
        (0, access_policy_1.assertCanTouchSuperAdmin)(actor, current.role.code);
        await this.assertRetainSuperAdmin(current);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    status: client_1.UserStatus.LOCKED,
                    email: `deleted.${id}@users.local`,
                },
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId: id, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return { id };
    }
    async lock(actor, id) {
        const current = await this.getActiveUser(id);
        if (actor.id === current.id) {
            throw new common_1.ForbiddenException(messages_1.MESSAGES.SELF_LOCK);
        }
        (0, access_policy_1.assertCanTouchSuperAdmin)(actor, current.role.code);
        await this.assertRetainSuperAdmin(current);
        const [user] = await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id },
                data: { status: client_1.UserStatus.LOCKED },
                select: user_mapper_1.publicUserSelect,
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId: id, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return (0, user_mapper_1.mapUserResponse)(user);
    }
    async unlock(actor, id) {
        const current = await this.getActiveUser(id);
        (0, access_policy_1.assertCanTouchSuperAdmin)(actor, current.role.code);
        const user = await this.prisma.user.update({
            where: { id },
            data: { status: client_1.UserStatus.ACTIVE },
            select: user_mapper_1.publicUserSelect,
        });
        return (0, user_mapper_1.mapUserResponse)(user);
    }
    async assignRole(actor, id, dto) {
        const current = await this.getActiveUser(id);
        (0, access_policy_1.assertCanTouchSuperAdmin)(actor, current.role.code);
        const role = await this.getRoleWithPermissions(dto.roleId);
        if (current.role.code === system_1.SUPER_ADMIN_ROLE_CODE &&
            role.code !== system_1.SUPER_ADMIN_ROLE_CODE) {
            await this.assertRetainSuperAdmin(current);
        }
        (0, access_policy_1.assertCanAssignRole)(actor, role.code, role.permissionCodes);
        const [user] = await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id },
                data: { roleId: role.id },
                select: user_mapper_1.publicUserSelect,
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId: id, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return (0, user_mapper_1.mapUserResponse)(user);
    }
    async getActiveUser(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: user_mapper_1.publicUserSelect,
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        return user;
    }
    async getRoleWithPermissions(roleId) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            select: {
                id: true,
                code: true,
                permissions: {
                    select: { permission: { select: { code: true } } },
                },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException('Không tìm thấy role');
        }
        return {
            id: role.id,
            code: role.code,
            permissionCodes: role.permissions.map((item) => item.permission.code),
        };
    }
    async assertEmailAvailable(email) {
        const existing = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.ConflictException(messages_1.MESSAGES.EMAIL_IN_USE);
        }
    }
    async assertRetainSuperAdmin(user) {
        if (user.role.code !== system_1.SUPER_ADMIN_ROLE_CODE) {
            return;
        }
        const others = await this.prisma.user.count({
            where: {
                deletedAt: null,
                status: client_1.UserStatus.ACTIVE,
                id: { not: user.id },
                role: { code: system_1.SUPER_ADMIN_ROLE_CODE },
            },
        });
        if (others === 0) {
            throw new common_1.ForbiddenException(messages_1.MESSAGES.SUPER_ADMIN_PROTECTED);
        }
    }
    rethrowEmailConflict(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException(messages_1.MESSAGES.EMAIL_IN_USE);
        }
        throw error;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map