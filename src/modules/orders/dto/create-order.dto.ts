import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from '../../../generated/prisma/client';

export class CreateOrderDto {
  @ApiProperty({
    type: [String],
    example: ['11111111-1111-4111-8111-111111111111'],
    description: 'Danh sách id sản phẩm; backend lấy giá từ DB để tính tổng',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Đơn hàng cần ít nhất một sản phẩm' })
  @IsUUID('4', { each: true, message: 'Id sản phẩm không hợp lệ' })
  productIds!: string[];

  @ApiPropertyOptional({ example: 'khach@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(255)
  email?: string;

  @ApiProperty({ example: '0901234567' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(8, { message: 'Số điện thoại không hợp lệ' })
  @MaxLength(20)
  phone!: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, Q.1, TP.HCM' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1, { message: 'Địa chỉ giao hàng không được để trống' })
  @MaxLength(1000)
  shippingAddress!: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  note?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.AT_STORE })
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod!: PaymentMethod;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/uploads/orders/transfer.jpg',
  })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_protocol: true }, { message: 'Ảnh chuyển khoản phải là URL hợp lệ' })
  @MaxLength(2048)
  paymentImageUrl?: string | null;

  @ApiPropertyOptional({
    example: '2026-11-20',
    description: 'Bắt buộc khi thanh toán chuyển khoản',
  })
  @ValidateIf(
    (o: CreateOrderDto) =>
      o.paymentMethod === PaymentMethod.BANK_TRANSFER &&
      o.deliveryDate !== undefined &&
      o.deliveryDate !== null &&
      o.deliveryDate !== '',
  )
  @IsDateString({}, { message: 'Ngày giao hàng không hợp lệ' })
  @Type(() => String)
  deliveryDate?: string;

  @ApiPropertyOptional({ example: '09:00-11:00' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deliveryTime?: string;
}
