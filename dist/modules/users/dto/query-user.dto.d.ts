import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { UserStatus } from '../../../generated/prisma/client';
export declare class QueryUserDto extends PaginationQueryDto {
    search?: string;
    status?: UserStatus;
    roleId?: string;
}
