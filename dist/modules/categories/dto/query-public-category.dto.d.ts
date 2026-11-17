import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
export declare class QueryPublicCategoryDto extends PaginationQueryDto {
    search?: string;
    parentId?: string;
}
