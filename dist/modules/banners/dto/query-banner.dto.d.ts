import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
export declare class QueryBannerDto extends PaginationQueryDto {
    search?: string;
    position?: string;
    isActive?: boolean;
}
export declare class QueryPublicBannerDto {
    position?: string;
}
