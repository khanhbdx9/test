import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { assertCanGrant } from '../auth/access.policy';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import {
  PermissionResponseDto,
  RoleDetailResponseDto,
  RolePermissionsResponseDto,
  RoleResponseDto,
} from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const permissionSelect = {
  id: true,
  code: true,
  module: true,
  action: true,
  description: true,
} as const;

const roleSelect = {
  id: true,
  code: true,
  name: true,
  description: true,
  isSystem: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRoleDto): Promise<{
    items: RoleResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.RoleWhereInput = query.search
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

    return { items: roles, pagination: buildPagination(page, limit, total) };
  }

  async findOne(id: string): Promise<RoleDetailResponseDto> {
    const role = await this.getRole(id);
    return this.toDetail(role);
  }

  async create(
    actor: AuthenticatedUser,
    dto: CreateRoleDto,
  ): Promise<RoleDetailResponseDto> {
    const permissions = await this.resolvePermissions(dto.permissionIds ?? []);
    assertCanGrant(
      actor,
      permissions.map((permission) => permission.code),
    );

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
    } catch (error) {
      this.rethrowCodeConflict(error);
    }
  }

  async update(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.getRole(id);
    this.assertMutable(role.isSystem);
    const data: Prisma.RoleUpdateInput = {};
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
    } catch (error) {
      this.rethrowCodeConflict(error);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    const role = await this.getRole(id);
    this.assertMutable(role.isSystem);
    const used = await this.prisma.user.count({ where: { roleId: id } });
    if (used > 0) {
      throw new ConflictException(MESSAGES.ROLE_IN_USE);
    }
    await this.prisma.role.delete({ where: { id } });
    return { id };
  }

  async listPermissions(id: string): Promise<RolePermissionsResponseDto> {
    const role = await this.getRole(id);
    return { permissions: this.mapPermissions(role) };
  }

  async replacePermissions(
    actor: AuthenticatedUser,
    id: string,
    dto: AssignPermissionsDto,
  ): Promise<RolePermissionsResponseDto> {
    const role = await this.getRole(id);
    this.assertMutable(role.isSystem);
    const permissions = await this.resolvePermissions(dto.permissionIds);
    assertCanGrant(
      actor,
      permissions.map((permission) => permission.code),
    );

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

  private async getRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: {
        ...roleSelect,
        permissions: { select: { permission: { select: permissionSelect } } },
      },
    });
    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  private async resolvePermissions(permissionIds: string[]) {
    const uniqueIds = [...new Set(permissionIds)];
    if (uniqueIds.length === 0) {
      return [];
    }
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: uniqueIds } },
      select: permissionSelect,
    });
    if (permissions.length !== uniqueIds.length) {
      throw new NotFoundException('Không tìm thấy quyền');
    }
    return permissions;
  }

  private assertMutable(isSystem: boolean): void {
    if (isSystem) {
      throw new ForbiddenException(MESSAGES.SYSTEM_ROLE_PROTECTED);
    }
  }

  private mapPermissions(role: {
    permissions: { permission: PermissionResponseDto }[];
  }): PermissionResponseDto[] {
    return role.permissions.map((item) => item.permission);
  }

  private toDetail(role: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
    permissions: { permission: PermissionResponseDto }[];
  }): RoleDetailResponseDto {
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

  private rethrowCodeConflict(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Mã role đã tồn tại');
    }
    throw error;
  }
}
