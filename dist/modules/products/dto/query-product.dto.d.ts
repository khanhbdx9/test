import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ProductStatus } from '../../../generated/prisma/client';
export declare class QueryProductDto extends PaginationQueryDto {
    search?: string;
    status?: ProductStatus;
    categoryId?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
}
