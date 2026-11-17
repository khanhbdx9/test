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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFolderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UploadFolderDto {
    folder;
}
exports.UploadFolderDto = UploadFolderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'products/banh-kem/banh-dau-16',
        description: 'Folder tương đối trong uploads. Bỏ trống thì lưu trực tiếp trong uploads/',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string') {
            return value;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Folder không hợp lệ' }),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UploadFolderDto.prototype, "folder", void 0);
//# sourceMappingURL=upload-folder.dto.js.map