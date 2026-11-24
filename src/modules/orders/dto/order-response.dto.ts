import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FulfillmentMethod,
  OrderStatus,
  PaymentMethod,
} from '../../../generated/prisma/client';

export class OrderItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  productId!: string;

  @ApiProperty()
  variantId!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty({ description: 'Đơn giá hiệu lực (salePrice ?? price) của biến thể' })
  unitPrice!: string;

  @ApiProperty({ description: 'Thành tiền = unitPrice * quantity' })
  lineTotal!: string;

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  productSku!: string;

  @ApiProperty()
  variantSku!: string;

  @ApiProperty()
  size!: string;

  @ApiProperty()
  style!: string;

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

  @ApiPropertyOptional({ nullable: true })
  shippingAddress!: string | null;

  @ApiPropertyOptional({ nullable: true })
  fullName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  note!: string | null;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @ApiPropertyOptional({ nullable: true })
  paymentImageUrl!: string | null;

  @ApiProperty({ enum: FulfillmentMethod })
  fulfillmentMethod!: FulfillmentMethod;

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

  @ApiProperty({ example: '450000.00' })
  totalAmount!: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
