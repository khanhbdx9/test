import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/api-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { PostResponseDto } from '../../posts/dto/post-response.dto';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class PublicFilterSuggestionDto {
  @ApiProperty()
  type!: 'category' | 'post' | 'product';

  @ApiProperty()
  id!: string;

  @ApiProperty()
  label!: string;

  @ApiPropertyOptional({ nullable: true })
  slug!: string | null;
}

export class PublicFilterResponseDto {
  @ApiPropertyOptional({
    nullable: true,
    example: 'bánh kem',
    description: 'Từ khóa search đã áp dụng (null nếu không truyền)',
  })
  search!: string | null;

  @ApiProperty({ type: [ProductResponseDto] })
  products!: ProductResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination!: PaginationMetaDto;

  @ApiProperty({
    type: [CategoryResponseDto],
    description: 'Danh mục khớp từ khóa (tối đa 8; rỗng nếu không có search)',
  })
  categories!: CategoryResponseDto[];

  @ApiProperty({
    type: [PostResponseDto],
    description: 'Bài viết khớp từ khóa (tối đa 5; rỗng nếu không có search)',
  })
  posts!: PostResponseDto[];

  @ApiProperty({ type: [PublicFilterSuggestionDto] })
  suggestions!: PublicFilterSuggestionDto[];
}
