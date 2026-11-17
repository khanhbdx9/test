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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const upload_folder_dto_1 = require("./dto/upload-folder.dto");
const upload_image_response_dto_1 = require("./dto/upload-image-response.dto");
const image_file_1 = require("./image-file");
const uploads_service_1 = require("./uploads.service");
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    uploadImages(files, query, request) {
        const protocol = request.get('x-forwarded-proto') ?? request.protocol;
        return this.uploadsService.saveImages(files, `${protocol}://${request.get('host')}`, query.folder ?? undefined);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('images'),
    (0, permissions_decorator_1.AnyPermissions)('products.create', 'posts.create', 'banners.manage', 'themes.manage'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload nhiều ảnh, folder tùy chọn; không truyền thì lưu trong uploads/, tổng tối đa 10MB',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['files'],
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    }),
    (0, api_standard_response_decorator_1.ApiStandardArrayResponse)({
        type: upload_image_response_dto_1.UploadImageResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', image_file_1.MAX_UPLOAD_FILES, {
        limits: { fileSize: image_file_1.MAX_TOTAL_UPLOAD_BYTES },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_folder_dto_1.UploadFolderDto, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadImages", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('Uploads'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map