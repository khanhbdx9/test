"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalImageStorage = exports.UPLOAD_DIR = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
exports.UPLOAD_DIR = (0, node_path_1.join)(process.cwd(), 'uploads');
let LocalImageStorage = class LocalImageStorage {
    async save(file) {
        const folder = this.assertInsideUploads(file.folder);
        const absoluteFolder = folder ? (0, node_path_1.join)(exports.UPLOAD_DIR, folder) : exports.UPLOAD_DIR;
        await (0, promises_1.mkdir)(absoluteFolder, { recursive: true });
        const filename = `${(0, node_crypto_1.randomUUID)()}${file.extension}`;
        const relativePath = folder ? `${folder}/${filename}` : filename;
        await (0, promises_1.writeFile)((0, node_path_1.join)(exports.UPLOAD_DIR, relativePath), file.buffer);
        return { relativePath };
    }
    async removeRelativePaths(paths) {
        for (const path of paths) {
            const relative = this.assertInsideUploads(path);
            try {
                await (0, promises_1.unlink)((0, node_path_1.join)(exports.UPLOAD_DIR, relative));
            }
            catch {
            }
        }
    }
    async removeFolder(folder) {
        const relative = this.assertInsideUploads(folder);
        if (!relative) {
            return;
        }
        try {
            await (0, promises_1.rm)((0, node_path_1.join)(exports.UPLOAD_DIR, relative), { recursive: true, force: true });
        }
        catch {
        }
    }
    assertInsideUploads(relativePath) {
        const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
        if (normalized.includes('..')) {
            throw new Error('Đường dẫn upload không hợp lệ');
        }
        if (!normalized) {
            return '';
        }
        const absolute = (0, node_path_1.resolve)(exports.UPLOAD_DIR, normalized);
        if (!absolute.startsWith((0, node_path_1.resolve)(exports.UPLOAD_DIR))) {
            throw new Error('Đường dẫn upload không hợp lệ');
        }
        return normalized;
    }
};
exports.LocalImageStorage = LocalImageStorage;
exports.LocalImageStorage = LocalImageStorage = __decorate([
    (0, common_1.Injectable)()
], LocalImageStorage);
//# sourceMappingURL=local-image.storage.js.map