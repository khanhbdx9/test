import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateSystemConfigDto {
  @ApiProperty({ example: 'EMAIL_NOTIFICATION' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'Key chỉ gồm chữ in hoa, số và gạch dưới',
  })
  key!: string;

  @ApiProperty({ example: 'owner@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  value!: string;

  @ApiPropertyOptional({ example: 'Email nhận thông báo đơn hàng mới' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
