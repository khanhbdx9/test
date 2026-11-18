import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PostStatus } from '../../../generated/prisma/client';

export class CreatePostDto {
  @ApiProperty({ example: 'Cách chọn bánh sinh nhật' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ example: 'cach-chon-banh-sinh-nhat' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug chỉ gồm chữ thường, số và dấu gạch ngang',
  })
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/posts/thumb.jpg',
  })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  thumbnailUrl?: string | null;

  @ApiProperty({
    description: 'Nội dung HTML từ CKEditor',
    example: '<p>Nội dung bài viết</p>',
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  excerpt?: string;

  @ApiPropertyOptional({ enum: PostStatus, default: PostStatus.DRAFT })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({
    default: false,
    description: 'Hiển thị trên landing page',
  })
  @IsOptional()
  @IsBoolean()
  showOnLanding?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;
}
