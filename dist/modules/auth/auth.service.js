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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const messages_1 = require("../../common/constants/messages");
const duration_util_1 = require("../../common/utils/duration.util");
const password_util_1 = require("../../common/utils/password.util");
const refresh_token_util_1 = require("../../common/utils/refresh-token.util");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const authenticated_user_1 = require("./authenticated-user");
let AuthService = class AuthService {
    prisma;
    jwtService;
    accessSecret;
    accessTtlSeconds;
    expiresIn;
    refreshSecret;
    refreshTtlMs;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.accessSecret = configService.getOrThrow('jwt.secret');
        this.expiresIn = configService.getOrThrow('jwt.expiresIn');
        this.accessTtlSeconds = (0, duration_util_1.parseDurationMs)(this.expiresIn) / 1000;
        this.refreshSecret = configService.getOrThrow('jwt.refreshSecret');
        this.refreshTtlMs = (0, duration_util_1.parseDurationMs)(configService.getOrThrow('jwt.refreshExpiresIn'));
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: authenticated_user_1.authUserSelect,
        });
        if (!user || user.deletedAt) {
            throw new common_1.UnauthorizedException(messages_1.MESSAGES.INVALID_CREDENTIALS);
        }
        const matched = await (0, password_util_1.verifyPassword)(dto.password, user.passwordHash);
        if (!matched) {
            throw new common_1.UnauthorizedException(messages_1.MESSAGES.INVALID_CREDENTIALS);
        }
        if (user.status === client_1.UserStatus.LOCKED) {
            throw new common_1.ForbiddenException(messages_1.MESSAGES.ACCOUNT_LOCKED);
        }
        const authenticated = (0, authenticated_user_1.mapAuthenticatedUser)(user);
        const tokens = await this.issueTokens(authenticated.id, authenticated.email);
        return { ...tokens, user: this.toMe(authenticated) };
    }
    async refresh(refreshToken) {
        const tokenHash = (0, refresh_token_util_1.hashRefreshToken)(refreshToken, this.refreshSecret);
        const existing = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
        });
        if (!existing) {
            throw new common_1.UnauthorizedException();
        }
        if (existing.revokedAt) {
            await this.revokeActiveTokens(existing.userId);
            throw new common_1.UnauthorizedException();
        }
        if (existing.expiresAt.getTime() <= Date.now()) {
            throw new common_1.UnauthorizedException();
        }
        const user = await this.prisma.user.findFirst({
            where: { id: existing.userId, deletedAt: null },
            select: authenticated_user_1.authUserSelect,
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        if (user.status === client_1.UserStatus.LOCKED) {
            throw new common_1.ForbiddenException(messages_1.MESSAGES.ACCOUNT_LOCKED);
        }
        const tokens = await this.createTokenPair(user.id, user.email);
        await this.prisma.$transaction(async (tx) => {
            const created = await tx.refreshToken.create({
                data: {
                    userId: user.id,
                    tokenHash: tokens.refreshTokenHash,
                    expiresAt: tokens.refreshExpiresAt,
                },
            });
            const rotated = await tx.refreshToken.updateMany({
                where: { id: existing.id, revokedAt: null },
                data: { revokedAt: new Date(), replacedById: created.id },
            });
            if (rotated.count !== 1) {
                throw new common_1.UnauthorizedException();
            }
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: this.expiresIn,
        };
    }
    async logout(actor, refreshToken) {
        const tokenHash = (0, refresh_token_util_1.hashRefreshToken)(refreshToken, this.refreshSecret);
        const revoked = await this.prisma.refreshToken.updateMany({
            where: { tokenHash, userId: actor.id, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        if (revoked.count !== 1) {
            throw new common_1.UnauthorizedException();
        }
        return { revoked: true };
    }
    me(actor) {
        return this.toMe(actor);
    }
    async issueTokens(userId, email) {
        const tokens = await this.createTokenPair(userId, email);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash: tokens.refreshTokenHash,
                expiresAt: tokens.refreshExpiresAt,
            },
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: this.expiresIn,
        };
    }
    async createTokenPair(userId, email) {
        const accessToken = await this.jwtService.signAsync({ sub: userId, email }, { secret: this.accessSecret, expiresIn: this.accessTtlSeconds });
        const refreshToken = (0, refresh_token_util_1.createRefreshToken)();
        return {
            accessToken,
            refreshToken,
            refreshTokenHash: (0, refresh_token_util_1.hashRefreshToken)(refreshToken, this.refreshSecret),
            refreshExpiresAt: new Date(Date.now() + this.refreshTtlMs),
        };
    }
    revokeActiveTokens(userId) {
        return this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    toMe(user) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            status: user.status,
            role: {
                id: user.role.id,
                code: user.role.code,
                name: user.role.name,
            },
            permissions: user.role.permissions,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map