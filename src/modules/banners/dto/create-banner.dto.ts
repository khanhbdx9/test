import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'Banner trang chủ' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: 'https://cdn.example.com/banners/home-desktop.jpg' })
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  desktopImageUrl!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/banners/home-mobile.jpg',
  })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  mobileImageUrl?: string | null;

  @ApiPropertyOptional({ example: '/products' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  link?: string | null;

  @ApiProperty({ example: 'home_hero' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  position!: string;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startsAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endsAt?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
