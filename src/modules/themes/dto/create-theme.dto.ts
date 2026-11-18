import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateThemeDto {
  @ApiProperty({ example: 'Minh Sam Classic' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'classic' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Code chỉ gồm chữ thường, số và dấu gạch ngang',
  })
  code!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({
    example: { primaryColor: '#8b3a2b', fontFamily: 'Georgia' },
  })
  @IsObject({ message: 'Config phải là object JSON' })
  config!: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/themes/classic.jpg' })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  previewUrl?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
