"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProductImages = normalizeProductImages;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
function normalizeProductImages(images) {
    const coverCount = images.filter((image) => image.isCover === true).length;
    if (coverCount > 1) {
        throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_COVER);
    }
    const writes = images.map((image, index) => ({
        url: image.url,
        alt: image.alt ?? null,
        sortOrder: image.sortOrder ?? index,
        isCover: image.isCover === true,
    }));
    if (coverCount === 0 && writes.length > 0) {
        let pick = 0;
        for (let index = 1; index < writes.length; index += 1) {
            if (writes[index].sortOrder < writes[pick].sortOrder) {
                pick = index;
            }
        }
        writes[pick].isCover = true;
    }
    return writes;
}
//# sourceMappingURL=product-images.js.map