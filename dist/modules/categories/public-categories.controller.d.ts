import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryPublicCategoryDto } from './dto/query-public-category.dto';
export declare class PublicCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findVisible(query: QueryPublicCategoryDto): Promise<{
        items: CategoryResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findVisibleOne(id: string): Promise<CategoryResponseDto>;
}
