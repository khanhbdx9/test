import { BannersService } from './banners.service';
import { BannerResponseDto, DeletedBannerResponseDto } from './dto/banner-response.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(query: QueryBannerDto): Promise<{
        items: BannerResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<BannerResponseDto>;
    create(dto: CreateBannerDto): Promise<BannerResponseDto>;
    update(id: string, dto: UpdateBannerDto): Promise<BannerResponseDto>;
    remove(id: string): Promise<DeletedBannerResponseDto>;
}
