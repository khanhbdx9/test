"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_UPLOAD_FILES = exports.MAX_TOTAL_UPLOAD_BYTES = void 0;
exports.assertImageFile = assertImageFile;
exports.assertTotalUploadSize = assertTotalUploadSize;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
exports.MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024;
exports.MAX_UPLOAD_FILES = 20;
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const SIGNATURES = {
    'image/jpeg': {
        extension: '.jpg',
        matches: (file) => file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff,
    },
    'image/png': {
        extension: '.png',
        matches: (file) => file.subarray(0, PNG.length).equals(PNG),
    },
    'image/webp': {
        extension: '.webp',
        matches: (file) => file.subarray(0, 4).toString('ascii') === 'RIFF' &&
            file.subarray(8, 12).toString('ascii') === 'WEBP',
    },
};
function assertImageFile(file) {
    const signature = SIGNATURES[file.mimetype];
    if (!signature || !signature.matches(file.buffer)) {
        throw new common_1.BadRequestException(messages_1.MESSAGES.INVALID_IMAGE);
    }
    return signature.extension;
}
function assertTotalUploadSize(files) {
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > exports.MAX_TOTAL_UPLOAD_BYTES) {
        throw new common_1.BadRequestException(messages_1.MESSAGES.FILE_TOO_LARGE);
    }
}
//# sourceMappingURL=image-file.js.map