import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  FulfillmentMethod,
  PaymentMethod,
} from '../../../generated/prisma/client';

export class CreateOrderItemDto {
  @ApiProperty({ example: '11111111-1111-4111-8111-111111111111' })
  @IsUUID('4', { message: 'Id sản phẩm không hợp lệ' })
  productId!: string;

  @ApiProperty({ example: '22222222-2222-4222-8222-222222222222' })
  @IsUUID('4', { message: 'Id biến thể không hợp lệ' })
  variantId!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'Đơn hàng cần ít nhất một sản phẩm' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1, { message: 'Họ tên không được để trống' })
  @MaxLength(255)
  fullName!: string;

  @ApiProperty({ example: '0901234567' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(8, { message: 'Số điện thoại không hợp lệ' })
  @MaxLength(20)
  phone!: string;

  @ApiPropertyOptional({ example: 'khach@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(255)
  email?: string;

  @ApiProperty({ enum: FulfillmentMethod, example: FulfillmentMethod.PICKUP })
  @IsEnum(FulfillmentMethod, { message: 'Hình thức nhận hàng không hợp lệ' })
  fulfillmentMethod!: FulfillmentMethod;

  @ApiPropertyOptional({
    nullable: true,
    example: '123 Nguyễn Huệ, Q.1, TP.HCM',
    description: 'Bắt buộc khi fulfillmentMethod = DELIVERY',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === null || value === undefined) {
      return null;
    }
    return typeof value === 'string' ? value.trim() : value;
  })
  @ValidateIf(
    (o: CreateOrderDto) => o.fulfillmentMethod === FulfillmentMethod.DELIVERY,
  )
  @IsString()
  @MinLength(1, { message: 'Địa chỉ giao hàng không được để trống' })
  @MaxLength(1000)
  shippingAddress?: string | null;

  @ApiPropertyOptional({
    example: '2026-11-25',
    description: 'Bắt buộc khi thanh toán chuyển khoản',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày giao hàng không hợp lệ' })
  @Type(() => String)
  deliveryDate?: string;

  @ApiPropertyOptional({ example: '14:00-16:00' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deliveryTime?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.AT_STORE })
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod!: PaymentMethod;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/uploads/orders/transfer.jpg',
  })
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl(
    { require_protocol: true },
    { message: 'Ảnh chuyển khoản phải là URL hợp lệ' },
  )
  @MaxLength(2048)
  paymentImageUrl?: string | null;

  @ApiPropertyOptional({ example: 'Nhận bánh tại cửa hàng' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  note?: string;
}
