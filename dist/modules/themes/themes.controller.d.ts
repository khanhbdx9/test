import { CreateThemeDto } from './dto/create-theme.dto';
import { QueryThemeDto } from './dto/query-theme.dto';
import { DeletedThemeResponseDto, ThemeResponseDto } from './dto/theme-response.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemesService } from './themes.service';
export declare class ThemesController {
    private readonly themesService;
    constructor(themesService: ThemesService);
    findAll(query: QueryThemeDto): Promise<{
        items: ThemeResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<ThemeResponseDto>;
    create(dto: CreateThemeDto): Promise<ThemeResponseDto>;
    update(id: string, dto: UpdateThemeDto): Promise<ThemeResponseDto>;
    remove(id: string): Promise<DeletedThemeResponseDto>;
}
