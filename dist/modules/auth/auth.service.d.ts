import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from './authenticated-user';
import { LoginResponseDto, LogoutResponseDto, MeResponseDto, TokenResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly accessSecret;
    private readonly accessTtlSeconds;
    private readonly expiresIn;
    private readonly refreshSecret;
    private readonly refreshTtlMs;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    login(dto: LoginDto): Promise<LoginResponseDto>;
    refresh(refreshToken: string): Promise<TokenResponseDto>;
    logout(actor: AuthenticatedUser, refreshToken: string): Promise<LogoutResponseDto>;
    me(actor: AuthenticatedUser): MeResponseDto;
    private issueTokens;
    private createTokenPair;
    private revokeActiveTokens;
    private toMe;
}
