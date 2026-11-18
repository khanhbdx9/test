import { PrismaService } from '../../database/prisma/prisma.service';
import { PublicSearchDto } from './dto/public-search.dto';
import { PublicSearchResponseDto } from './dto/public-search-response.dto';
export declare class PublicSearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    search(dto: PublicSearchDto): Promise<PublicSearchResponseDto>;
    private resolveCategoryId;
    private buildPriceFilter;
    private resolveOrder;
    private buildSuggestions;
    private toProduct;
}
