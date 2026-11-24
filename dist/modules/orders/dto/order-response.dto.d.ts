import { FulfillmentMethod, OrderStatus, PaymentMethod } from '../../../generated/prisma/client';
export declare class OrderItemResponseDto {
    id: string;
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    productName: string;
    productSku: string;
    variantSku: string;
    size: string;
    style: string;
    imageUrl: string | null;
}
export declare class OrderResponseDto {
    id: string;
    email: string | null;
    phone: string;
    shippingAddress: string | null;
    fullName: string | null;
    note: string | null;
    paymentMethod: PaymentMethod;
    paymentImageUrl: string | null;
    fulfillmentMethod: FulfillmentMethod;
    status: OrderStatus;
    deliveryDate: string | null;
    deliveryTime: string | null;
    totalAmount: string;
    items: OrderItemResponseDto[];
    createdAt: Date;
    updatedAt: Date;
}
