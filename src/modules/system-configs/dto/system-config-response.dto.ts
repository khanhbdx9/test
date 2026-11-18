import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SystemConfigResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  key!: string;

  @ApiProperty()
  value!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class DeletedSystemConfigResponseDto {
  @ApiProperty()
  id!: string;
}
