import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  OrderStatus,
  PaymentMethod,
} from '../../../generated/prisma/client';

export class OrderProductItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  sku!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ description: 'Giá hiệu lực (salePrice ?? price)' })
  unitPrice!: string;

  @ApiPropertyOptional({ nullable: true })
  imageUrl!: string | null;
}

export class OrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  shippingAddress!: string;

  @ApiPropertyOptional({ nullable: true })
  fullName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  note!: string | null;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @ApiPropertyOptional({ nullable: true })
  paymentImageUrl!: string | null;

  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus;

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-11-20',
    description: 'YYYY-MM-DD',
  })
  deliveryDate!: string | null;

  @ApiPropertyOptional({ nullable: true })
  deliveryTime!: string | null;

  @ApiProperty({ type: [String] })
  productIds!: string[];

  @ApiProperty({ example: '450000.00' })
  totalAmount!: string;

  @ApiProperty({ type: [OrderProductItemDto] })
  products!: OrderProductItemDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
