import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { QueryThemeDto } from './dto/query-theme.dto';
import { DeletedThemeResponseDto, ThemeResponseDto } from './dto/theme-response.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
export declare class ThemesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryThemeDto): Promise<{
        items: ThemeResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<ThemeResponseDto>;
    findActive(): Promise<ThemeResponseDto | null>;
    create(dto: CreateThemeDto): Promise<ThemeResponseDto>;
    update(id: string, dto: UpdateThemeDto): Promise<ThemeResponseDto>;
    remove(id: string): Promise<DeletedThemeResponseDto>;
    private getTheme;
    private toResponse;
    private rethrowUnique;
}
