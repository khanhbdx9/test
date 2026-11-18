export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly LOCKED: "LOCKED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const CategoryStatus: {
    readonly VISIBLE: "VISIBLE";
    readonly HIDDEN: "HIDDEN";
};
export type CategoryStatus = (typeof CategoryStatus)[keyof typeof CategoryStatus];
export declare const ProductStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
    readonly HIDDEN: "HIDDEN";
};
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
export declare const VariantStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
export type VariantStatus = (typeof VariantStatus)[keyof typeof VariantStatus];
export declare const PaymentMethod: {
    readonly AT_STORE: "AT_STORE";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const OrderStatus: {
    readonly PENDING_CONFIRMATION: "PENDING_CONFIRMATION";
    readonly REJECTED: "REJECTED";
    readonly CONFIRMED: "CONFIRMED";
    readonly NEED_CALLBACK: "NEED_CALLBACK";
    readonly COMPLETED: "COMPLETED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const NotificationType: {
    readonly ORDER_CREATED: "ORDER_CREATED";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const PostStatus: {
    readonly DRAFT: "DRAFT";
    readonly PUBLISHED: "PUBLISHED";
};
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
