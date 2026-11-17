import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryUserDto): Promise<{
        items: UserResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<UserResponseDto>;
    create(actor: AuthenticatedUser, dto: CreateUserDto): Promise<UserResponseDto>;
    update(actor: AuthenticatedUser, id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
    remove(actor: AuthenticatedUser, id: string): Promise<{
        id: string;
    }>;
    lock(actor: AuthenticatedUser, id: string): Promise<UserResponseDto>;
    unlock(actor: AuthenticatedUser, id: string): Promise<UserResponseDto>;
    assignRole(actor: AuthenticatedUser, id: string, dto: AssignRoleDto): Promise<UserResponseDto>;
    private getActiveUser;
    private getRoleWithPermissions;
    private assertEmailAvailable;
    private assertRetainSuperAdmin;
    private rethrowEmailConflict;
}
