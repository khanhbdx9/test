import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ThemeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  config!: Record<string, unknown>;

  @ApiPropertyOptional({ nullable: true })
  previewUrl!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeletedThemeResponseDto {
  @ApiProperty()
  id!: string;
}
