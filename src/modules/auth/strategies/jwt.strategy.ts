import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MESSAGES } from '../../../common/constants/messages';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { UserStatus } from '../../../generated/prisma/client';
import {
  AuthenticatedUser,
  authUserSelect,
  mapAuthenticatedUser,
} from '../authenticated-user';

interface AccessTokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: authUserSelect,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.status === UserStatus.LOCKED) {
      throw new ForbiddenException(MESSAGES.ACCOUNT_LOCKED);
    }
    return mapAuthenticatedUser(user);
  }
}
