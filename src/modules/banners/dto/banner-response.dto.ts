import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BannerResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  desktopImageUrl!: string;

  @ApiPropertyOptional({ nullable: true })
  mobileImageUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  link!: string | null;

  @ApiProperty()
  position!: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiPropertyOptional({ nullable: true })
  startsAt!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  endsAt!: Date | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeletedBannerResponseDto {
  @ApiProperty()
  id!: string;
}
