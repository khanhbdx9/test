"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProductVariants = normalizeProductVariants;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const client_1 = require("../../generated/prisma/client");
function normalizeProductVariants(variants) {
    const seen = new Set();
    return variants.map((variant, index) => {
        const sku = variant.sku.trim();
        if (seen.has(sku)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.DUPLICATE_VARIANT_SKU);
        }
        seen.add(sku);
        const price = new client_1.Prisma.Decimal(variant.price);
        const salePrice = variant.salePrice === undefined || variant.salePrice === null
            ? null
            : new client_1.Prisma.Decimal(variant.salePrice);
        if (salePrice && salePrice.gte(price)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_SALE_PRICE);
        }
        return {
            sku,
            size: variant.size.trim(),
            style: variant.style.trim(),
            price,
            salePrice,
            status: variant.status ?? client_1.VariantStatus.ACTIVE,
            sortOrder: variant.sortOrder ?? index,
        };
    });
}
//# sourceMappingURL=product-variants.js.map