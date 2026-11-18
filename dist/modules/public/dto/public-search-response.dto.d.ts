import { PaginationMetaDto } from '../../../common/dto/api-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { PostResponseDto } from '../../posts/dto/post-response.dto';
import { ProductResponseDto } from '../../products/dto/product-response.dto';
export declare class PublicSearchSuggestionDto {
    type: 'category' | 'post' | 'product';
    id: string;
    label: string;
    slug: string | null;
}
export declare class PublicSearchResponseDto {
    query: string;
    products: ProductResponseDto[];
    pagination: PaginationMetaDto;
    categories: CategoryResponseDto[];
    posts: PostResponseDto[];
    suggestions: PublicSearchSuggestionDto[];
}
