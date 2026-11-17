"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSafeSlug = assertSafeSlug;
exports.normalizeUploadFolder = normalizeUploadFolder;
exports.resolveUploadFolder = resolveUploadFolder;
exports.productUploadFolder = productUploadFolder;
exports.relativePathFromUploadUrl = relativePathFromUploadUrl;
exports.folderFromUploadUrl = folderFromUploadUrl;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function assertSafeSlug(value, label) {
    const slug = value.trim().toLowerCase();
    if (!SEGMENT.test(slug)) {
        throw new common_1.BadRequestException(`${label} không hợp lệ`);
    }
    return slug;
}
function normalizeUploadFolder(folder) {
    const normalized = folder
        .trim()
        .replace(/\\/g, '/')
        .replace(/^\/+|\/+$/g, '')
        .toLowerCase();
    if (!normalized) {
        throw new common_1.BadRequestException(messages_1.MESSAGES.UPLOAD_FOLDER_INVALID);
    }
    const segments = normalized.split('/').filter((part) => part.length > 0);
    if (segments.length === 0 || segments.length > 8) {
        throw new common_1.BadRequestException(messages_1.MESSAGES.UPLOAD_FOLDER_INVALID);
    }
    for (const segment of segments) {
        if (segment === '.' || segment === '..' || !SEGMENT.test(segment)) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.UPLOAD_FOLDER_INVALID);
        }
    }
    return segments.join('/');
}
function resolveUploadFolder(folder) {
    if (folder === undefined || folder === null || folder.trim() === '') {
        return '';
    }
    return normalizeUploadFolder(folder);
}
function productUploadFolder(categorySlug, productSlug) {
    return normalizeUploadFolder(`products/${assertSafeSlug(categorySlug, 'Slug danh mục')}/${assertSafeSlug(productSlug, 'Slug sản phẩm')}`);
}
function relativePathFromUploadUrl(url) {
    try {
        const pathname = url.startsWith('http') ? new URL(url).pathname : url;
        const marker = '/uploads/';
        const index = pathname.indexOf(marker);
        if (index < 0) {
            return null;
        }
        const relative = pathname.slice(index + marker.length);
        if (!relative || relative.includes('..')) {
            return null;
        }
        return relative;
    }
    catch {
        return null;
    }
}
function folderFromUploadUrl(url) {
    const relative = relativePathFromUploadUrl(url);
    if (!relative) {
        return null;
    }
    const parts = relative.split('/');
    if (parts.length < 2) {
        return '';
    }
    return parts.slice(0, -1).join('/');
}
//# sourceMappingURL=upload-path.js.map