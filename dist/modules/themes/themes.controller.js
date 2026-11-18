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
exports.ThemesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const create_theme_dto_1 = require("./dto/create-theme.dto");
const query_theme_dto_1 = require("./dto/query-theme.dto");
const theme_response_dto_1 = require("./dto/theme-response.dto");
const update_theme_dto_1 = require("./dto/update-theme.dto");
const themes_service_1 = require("./themes.service");
let ThemesController = class ThemesController {
    themesService;
    constructor(themesService) {
        this.themesService = themesService;
    }
    findAll(query) {
        return this.themesService.findAll(query);
    }
    findOne(id) {
        return this.themesService.findOne(id);
    }
    create(dto) {
        return this.themesService.create(dto);
    }
    update(id, dto) {
        return this.themesService.update(id, dto);
    }
    remove(id) {
        return this.themesService.remove(id);
    }
};
exports.ThemesController = ThemesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.AnyPermissions)('themes.view', 'themes.manage'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách theme' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: theme_response_dto_1.ThemeResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_theme_dto_1.QueryThemeDto]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.AnyPermissions)('themes.view', 'themes.manage'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết theme' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: theme_response_dto_1.ThemeResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('themes.manage'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo theme' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: theme_response_dto_1.ThemeResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_theme_dto_1.CreateThemeDto]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('themes.manage'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật theme' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: theme_response_dto_1.ThemeResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_theme_dto_1.UpdateThemeDto]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('themes.manage'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.DELETE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa theme' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: theme_response_dto_1.DeletedThemeResponseDto,
        description: messages_1.MESSAGES.DELETE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "remove", null);
exports.ThemesController = ThemesController = __decorate([
    (0, swagger_1.ApiTags)('Themes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('themes'),
    __metadata("design:paramtypes", [themes_service_1.ThemesService])
], ThemesController);
//# sourceMappingURL=themes.controller.js.map