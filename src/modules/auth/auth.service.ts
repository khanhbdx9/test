import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MESSAGES } from '../../common/constants/messages';
import { parseDurationMs } from '../../common/utils/duration.util';
import { verifyPassword } from '../../common/utils/password.util';
import {
  createRefreshToken,
  hashRefreshToken,
} from '../../common/utils/refresh-token.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserStatus } from '../../generated/prisma/client';
import {
  AuthenticatedUser,
  authUserSelect,
  mapAuthenticatedUser,
} from './authenticated-user';
import { LoginResponseDto, LogoutResponseDto, MeResponseDto, TokenResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly accessTtlSeconds: number;
  private readonly expiresIn: string;
  private readonly refreshSecret: string;
  private readonly refreshTtlMs: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.accessSecret = configService.getOrThrow<string>('jwt.secret');
    this.expiresIn = configService.getOrThrow<string>('jwt.expiresIn');
    this.accessTtlSeconds = parseDurationMs(this.expiresIn) / 1000;
    this.refreshSecret = configService.getOrThrow<string>('jwt.refreshSecret');
    this.refreshTtlMs = parseDurationMs(
      configService.getOrThrow<string>('jwt.refreshExpiresIn'),
    );
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: authUserSelect,
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    const matched = await verifyPassword(dto.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }
    if (user.status === UserStatus.LOCKED) {
      throw new ForbiddenException(MESSAGES.ACCOUNT_LOCKED);
    }

    const authenticated = mapAuthenticatedUser(user);
    const tokens = await this.issueTokens(authenticated.id, authenticated.email);
    return { ...tokens, user: this.toMe(authenticated) };
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const tokenHash = hashRefreshToken(refreshToken, this.refreshSecret);
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    if (!existing) {
      throw new UnauthorizedException();
    }
    if (existing.revokedAt) {
      await this.revokeActiveTokens(existing.userId);
      throw new UnauthorizedException();
    }
    if (existing.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findFirst({
      where: { id: existing.userId, deletedAt: null },
      select: authUserSelect,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.status === UserStatus.LOCKED) {
      throw new ForbiddenException(MESSAGES.ACCOUNT_LOCKED);
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
        throw new UnauthorizedException();
      }
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: this.expiresIn,
    };
  }

  async logout(
    actor: AuthenticatedUser,
    refreshToken: string,
  ): Promise<LogoutResponseDto> {
    const tokenHash = hashRefreshToken(refreshToken, this.refreshSecret);
    const revoked = await this.prisma.refreshToken.updateMany({
      where: { tokenHash, userId: actor.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (revoked.count !== 1) {
      throw new UnauthorizedException();
    }
    return { revoked: true };
  }

  me(actor: AuthenticatedUser): MeResponseDto {
    return this.toMe(actor);
  }

  private async issueTokens(
    userId: string,
    email: string,
  ): Promise<TokenResponseDto> {
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

  private async createTokenPair(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      { secret: this.accessSecret, expiresIn: this.accessTtlSeconds },
    );
    const refreshToken = createRefreshToken();
    return {
      accessToken,
      refreshToken,
      refreshTokenHash: hashRefreshToken(refreshToken, this.refreshSecret),
      refreshExpiresAt: new Date(Date.now() + this.refreshTtlMs),
    };
  }

  private revokeActiveTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private toMe(user: AuthenticatedUser): MeResponseDto {
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
}
