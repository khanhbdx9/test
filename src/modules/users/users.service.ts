import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { SUPER_ADMIN_ROLE_CODE } from '../../common/constants/system';
import { buildPagination } from '../../common/utils/pagination.util';
import { hashPassword } from '../../common/utils/password.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma, UserStatus } from '../../generated/prisma/client';
import {
  assertCanAssignRole,
  assertCanTouchSuperAdmin,
} from '../auth/access.policy';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { mapUserResponse, publicUserSelect } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUserDto): Promise<{
    items: UserResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.UserWhereInput = {
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
        select: publicUserSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: users.map(mapUserResponse),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    return mapUserResponse(await this.getActiveUser(id));
  }

  async create(
    actor: AuthenticatedUser,
    dto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const role = await this.getRoleWithPermissions(dto.roleId);
    assertCanAssignRole(actor, role.code, role.permissionCodes);
    await this.assertEmailAvailable(dto.email);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          fullName: dto.fullName,
          passwordHash: await hashPassword(dto.password),
          roleId: role.id,
        },
        select: publicUserSelect,
      });
      return mapUserResponse(user);
    } catch (error) {
      this.rethrowEmailConflict(error);
    }
  }

  async update(
    actor: AuthenticatedUser,
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const current = await this.getActiveUser(id);
    assertCanTouchSuperAdmin(actor, current.role.code);

    const data: Prisma.UserUpdateInput = {};
    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }
    if (dto.email !== undefined && dto.email !== current.email) {
      await this.assertEmailAvailable(dto.email);
      data.email = dto.email;
    }
    if (dto.password !== undefined) {
      data.passwordHash = await hashPassword(dto.password);
    }
    if (Object.keys(data).length === 0) {
      return mapUserResponse(current);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: publicUserSelect,
      });
      return mapUserResponse(user);
    } catch (error) {
      this.rethrowEmailConflict(error);
    }
  }

  async remove(actor: AuthenticatedUser, id: string): Promise<{ id: string }> {
    const current = await this.getActiveUser(id);
    if (actor.id === current.id) {
      throw new ForbiddenException(MESSAGES.SELF_DELETE);
    }
    assertCanTouchSuperAdmin(actor, current.role.code);
    await this.assertRetainSuperAdmin(current);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: UserStatus.LOCKED,
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

  async lock(actor: AuthenticatedUser, id: string): Promise<UserResponseDto> {
    const current = await this.getActiveUser(id);
    if (actor.id === current.id) {
      throw new ForbiddenException(MESSAGES.SELF_LOCK);
    }
    assertCanTouchSuperAdmin(actor, current.role.code);
    await this.assertRetainSuperAdmin(current);

    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { status: UserStatus.LOCKED },
        select: publicUserSelect,
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return mapUserResponse(user);
  }

  async unlock(actor: AuthenticatedUser, id: string): Promise<UserResponseDto> {
    const current = await this.getActiveUser(id);
    assertCanTouchSuperAdmin(actor, current.role.code);
    const user = await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
      select: publicUserSelect,
    });
    return mapUserResponse(user);
  }

  async assignRole(
    actor: AuthenticatedUser,
    id: string,
    dto: AssignRoleDto,
  ): Promise<UserResponseDto> {
    const current = await this.getActiveUser(id);
    assertCanTouchSuperAdmin(actor, current.role.code);
    const role = await this.getRoleWithPermissions(dto.roleId);
    if (
      current.role.code === SUPER_ADMIN_ROLE_CODE &&
      role.code !== SUPER_ADMIN_ROLE_CODE
    ) {
      await this.assertRetainSuperAdmin(current);
    }
    assertCanAssignRole(actor, role.code, role.permissionCodes);

    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { roleId: role.id },
        select: publicUserSelect,
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return mapUserResponse(user);
  }

  private async getActiveUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: publicUserSelect,
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  private async getRoleWithPermissions(roleId: string) {
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
      throw new NotFoundException('Không tìm thấy role');
    }
    return {
      id: role.id,
      code: role.code,
      permissionCodes: role.permissions.map((item) => item.permission.code),
    };
  }

  private async assertEmailAvailable(email: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(MESSAGES.EMAIL_IN_USE);
    }
  }

  private async assertRetainSuperAdmin(user: {
    id: string;
    role: { code: string };
  }): Promise<void> {
    if (user.role.code !== SUPER_ADMIN_ROLE_CODE) {
      return;
    }
    const others = await this.prisma.user.count({
      where: {
        deletedAt: null,
        status: UserStatus.ACTIVE,
        id: { not: user.id },
        role: { code: SUPER_ADMIN_ROLE_CODE },
      },
    });
    if (others === 0) {
      throw new ForbiddenException(MESSAGES.SUPER_ADMIN_PROTECTED);
    }
  }

  private rethrowEmailConflict(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(MESSAGES.EMAIL_IN_USE);
    }
    throw error;
  }
}
