import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadFolderDto {
  @ApiPropertyOptional({
    example: 'products/banh-kem/banh-dau-16',
    description:
      'Folder tương đối trong uploads. Bỏ trống thì lưu trực tiếp trong uploads/',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  })
  @IsOptional()
  @IsString({ message: 'Folder không hợp lệ' })
  @MaxLength(500)
  folder?: string;
}
