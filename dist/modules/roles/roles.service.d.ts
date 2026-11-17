import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { RoleDetailResponseDto, RolePermissionsResponseDto, RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryRoleDto): Promise<{
        items: RoleResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<RoleDetailResponseDto>;
    create(actor: AuthenticatedUser, dto: CreateRoleDto): Promise<RoleDetailResponseDto>;
    update(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto>;
    remove(id: string): Promise<{
        id: string;
    }>;
    listPermissions(id: string): Promise<RolePermissionsResponseDto>;
    replacePermissions(actor: AuthenticatedUser, id: string, dto: AssignPermissionsDto): Promise<RolePermissionsResponseDto>;
    private getRole;
    private resolvePermissions;
    private assertMutable;
    private mapPermissions;
    private toDetail;
    private rethrowCodeConflict;
}
