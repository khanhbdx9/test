import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CategoryStatus } from '../../../generated/prisma/client';
export declare class QueryCategoryDto extends PaginationQueryDto {
    search?: string;
    status?: CategoryStatus;
    parentId?: string;
}
