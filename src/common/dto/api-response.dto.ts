import { ApiProperty } from '@nestjs/swagger';

export class FieldErrorDto {
  @ApiProperty({ example: 'name' })
  field!: string;

  @ApiProperty({ example: 'Tên không được để trống' })
  message!: string;
}

export class ValidationErrorDataDto {
  @ApiProperty({ type: [FieldErrorDto] })
  errors!: FieldErrorDto[];
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;
}
