import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PostStatus } from '../../../generated/prisma/client';

export class QueryPostDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({ description: 'Lọc bài hiển thị trên landing' })
  @Transform(({ value }: { value: unknown }) => parseBoolean(value))
  @IsOptional()
  @IsBoolean()
  showOnLanding?: boolean;
}

export class QueryPublicPostDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Lọc theo tên bài viết',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
    description: 'Sắp xếp theo created_at',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortCreated?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    default: false,
    description:
      'false (mặc định): tất cả bài đã xuất bản; true: chỉ bài showOnLanding',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
      return false;
    }
    return parseBoolean(value);
  })
  @IsOptional()
  @IsBoolean()
  landing?: boolean = false;
}

export class QueryRelatedPostDto extends PaginationQueryDto {}

function parseBoolean(value: unknown): unknown {
  if (value === 'true' || value === true) {
    return true;
  }
  if (value === 'false' || value === false) {
    return false;
  }
  return value;
}
