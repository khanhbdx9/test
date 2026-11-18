import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PostStatus } from '../../../generated/prisma/client';
export declare class QueryPostDto extends PaginationQueryDto {
    search?: string;
    status?: PostStatus;
    showOnLanding?: boolean;
}
export declare class QueryPublicPostDto extends PaginationQueryDto {
    search?: string;
    sortCreated?: 'asc' | 'desc';
    landing?: boolean;
}
export declare class QueryRelatedPostDto extends PaginationQueryDto {
}
