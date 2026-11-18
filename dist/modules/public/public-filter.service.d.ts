import { PrismaService } from '../../database/prisma/prisma.service';
import { PublicFilterDto } from './dto/public-filter.dto';
import { PublicFilterResponseDto } from './dto/public-filter-response.dto';
export declare class PublicFilterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    filter(dto: PublicFilterDto): Promise<PublicFilterResponseDto>;
    private resolveCategoryId;
    private buildPriceFilter;
    private resolveOrder;
    private buildSuggestions;
    private toProduct;
}
