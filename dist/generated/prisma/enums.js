"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostStatus = exports.NotificationType = exports.OrderStatus = exports.FulfillmentMethod = exports.PaymentMethod = exports.VariantStatus = exports.ProductStatus = exports.CategoryStatus = exports.UserStatus = void 0;
exports.UserStatus = {
    ACTIVE: 'ACTIVE',
    LOCKED: 'LOCKED'
};
exports.CategoryStatus = {
    VISIBLE: 'VISIBLE',
    HIDDEN: 'HIDDEN'
};
exports.ProductStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    HIDDEN: 'HIDDEN'
};
exports.VariantStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};
exports.PaymentMethod = {
    AT_STORE: 'AT_STORE',
    BANK_TRANSFER: 'BANK_TRANSFER'
};
exports.FulfillmentMethod = {
    PICKUP: 'PICKUP',
    DELIVERY: 'DELIVERY'
};
exports.OrderStatus = {
    PENDING_CONFIRMATION: 'PENDING_CONFIRMATION',
    REJECTED: 'REJECTED',
    CONFIRMED: 'CONFIRMED',
    NEED_CALLBACK: 'NEED_CALLBACK',
    COMPLETED: 'COMPLETED'
};
exports.NotificationType = {
    ORDER_CREATED: 'ORDER_CREATED'
};
exports.PostStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED'
};
//# sourceMappingURL=enums.js.map