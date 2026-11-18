import { OrderStatus, PaymentMethod } from '../../../generated/prisma/client';
export declare class OrderProductItemDto {
    id: string;
    sku: string;
    name: string;
    unitPrice: string;
    imageUrl: string | null;
}
export declare class OrderResponseDto {
    id: string;
    email: string | null;
    phone: string;
    shippingAddress: string;
    fullName: string | null;
    note: string | null;
    paymentMethod: PaymentMethod;
    paymentImageUrl: string | null;
    status: OrderStatus;
    deliveryDate: string | null;
    deliveryTime: string | null;
    productIds: string[];
    totalAmount: string;
    products: OrderProductItemDto[];
    createdAt: Date;
    updatedAt: Date;
}
