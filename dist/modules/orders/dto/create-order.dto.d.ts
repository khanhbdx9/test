import { PaymentMethod } from '../../../generated/prisma/client';
export declare class CreateOrderDto {
    productIds: string[];
    email?: string;
    phone: string;
    shippingAddress: string;
    fullName?: string;
    note?: string;
    paymentMethod: PaymentMethod;
    paymentImageUrl?: string | null;
    deliveryDate?: string;
    deliveryTime?: string;
}
