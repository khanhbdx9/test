import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../../../generated/prisma/client';

export class PostAuthorDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;
}

export class PostResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  thumbnailUrl!: string | null;

  @ApiProperty({ description: 'HTML từ CKEditor' })
  content!: string;

  @ApiPropertyOptional({ nullable: true })
  excerpt!: string | null;

  @ApiProperty({ enum: PostStatus })
  status!: PostStatus;

  @ApiProperty({ description: 'Hiển thị trên landing page' })
  showOnLanding!: boolean;

  @ApiPropertyOptional({ nullable: true })
  publishedAt!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  seoTitle!: string | null;

  @ApiPropertyOptional({ nullable: true })
  seoDescription!: string | null;

  @ApiProperty({ type: PostAuthorDto })
  author!: PostAuthorDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeletedPostResponseDto {
  @ApiProperty()
  id!: string;
}
