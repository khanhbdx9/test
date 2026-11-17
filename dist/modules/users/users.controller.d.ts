import { AuthenticatedUser } from '../auth/authenticated-user';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: QueryUserDto): Promise<{
        items: UserResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<UserResponseDto>;
    create(actor: AuthenticatedUser, dto: CreateUserDto): Promise<UserResponseDto>;
    update(actor: AuthenticatedUser, id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
    lock(actor: AuthenticatedUser, id: string): Promise<UserResponseDto>;
    unlock(actor: AuthenticatedUser, id: string): Promise<UserResponseDto>;
    assignRole(actor: AuthenticatedUser, id: string, dto: AssignRoleDto): Promise<UserResponseDto>;
    remove(actor: AuthenticatedUser, id: string): Promise<{
        id: string;
    }>;
}
