import { FulfillmentMethod, PaymentMethod } from '../../../generated/prisma/client';
export declare class CreateOrderItemDto {
    productId: string;
    variantId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: CreateOrderItemDto[];
    fullName: string;
    phone: string;
    email?: string;
    fulfillmentMethod: FulfillmentMethod;
    shippingAddress?: string | null;
    deliveryDate?: string;
    deliveryTime?: string;
    paymentMethod: PaymentMethod;
    paymentImageUrl?: string | null;
    note?: string;
}
