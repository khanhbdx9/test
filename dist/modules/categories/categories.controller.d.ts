import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(query: QueryCategoryDto): Promise<{
        items: CategoryResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<CategoryResponseDto>;
    create(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
    update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
