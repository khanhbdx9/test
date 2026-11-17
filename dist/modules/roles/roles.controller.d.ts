import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { RoleDetailResponseDto, RolePermissionsResponseDto, RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(query: QueryRoleDto): Promise<{
        items: RoleResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    listPermissions(id: string): Promise<RolePermissionsResponseDto>;
    findOne(id: string): Promise<RoleDetailResponseDto>;
    create(actor: AuthenticatedUser, dto: CreateRoleDto): Promise<RoleDetailResponseDto>;
    update(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto>;
    replacePermissions(actor: AuthenticatedUser, id: string, dto: AssignPermissionsDto): Promise<RolePermissionsResponseDto>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
