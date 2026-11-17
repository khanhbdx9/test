"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = exports.IMAGE_STORAGE = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const image_file_1 = require("./image-file");
const upload_path_1 = require("./upload-path");
exports.IMAGE_STORAGE = 'IMAGE_STORAGE';
let UploadsService = class UploadsService {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async saveImages(files, baseUrl, folder) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException(messages_1.MESSAGES.FILE_REQUIRED);
        }
        (0, image_file_1.assertTotalUploadSize)(files);
        const target = (0, upload_path_1.resolveUploadFolder)(folder);
        const results = [];
        for (const file of files) {
            const extension = (0, image_file_1.assertImageFile)(file);
            const saved = await this.storage.save({
                buffer: file.buffer,
                extension,
                folder: target,
            });
            results.push({ url: `${baseUrl}/uploads/${saved.relativePath}` });
        }
        return results;
    }
    async removeFolder(folder) {
        await this.storage.removeFolder((0, upload_path_1.normalizeUploadFolder)(folder));
    }
    async removeUnusedImageUrls(previousUrls, nextUrls) {
        const kept = new Set(nextUrls);
        const paths = previousUrls
            .filter((url) => !kept.has(url))
            .map((url) => (0, upload_path_1.relativePathFromUploadUrl)(url))
            .filter((path) => path !== null);
        if (paths.length > 0) {
            await this.storage.removeRelativePaths(paths);
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(exports.IMAGE_STORAGE)),
    __metadata("design:paramtypes", [Object])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map