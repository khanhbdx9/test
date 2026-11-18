import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { BannerResponseDto, DeletedBannerResponseDto } from './dto/banner-response.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto, QueryPublicBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryBannerDto): Promise<{
        items: BannerResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findActive(query: QueryPublicBannerDto): Promise<BannerResponseDto[]>;
    findOne(id: string): Promise<BannerResponseDto>;
    create(dto: CreateBannerDto): Promise<BannerResponseDto>;
    update(id: string, dto: UpdateBannerDto): Promise<BannerResponseDto>;
    remove(id: string): Promise<DeletedBannerResponseDto>;
    private getBanner;
    private toResponse;
}
