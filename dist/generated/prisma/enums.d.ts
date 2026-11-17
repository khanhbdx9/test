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
