import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { QueryPublicCategoryDto } from './dto/query-public-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryCategoryDto): Promise<{
        items: CategoryResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findVisible(query: QueryPublicCategoryDto): Promise<{
        items: CategoryResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findVisibleOne(id: string): Promise<CategoryResponseDto>;
    findOne(id: string): Promise<CategoryResponseDto>;
    create(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
    update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    remove(id: string): Promise<{
        id: string;
    }>;
    private getActive;
    private assertParent;
    private resolveSlug;
    private rethrowSlugConflict;
}
