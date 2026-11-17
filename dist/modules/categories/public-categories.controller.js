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
exports.PublicCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const categories_service_1 = require("./categories.service");
const category_response_dto_1 = require("./dto/category-response.dto");
const query_public_category_dto_1 = require("./dto/query-public-category.dto");
let PublicCategoriesController = class PublicCategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    findVisible(query) {
        return this.categoriesService.findVisible(query);
    }
    findVisibleOne(id) {
        return this.categoriesService.findVisibleOne(id);
    }
};
exports.PublicCategoriesController = PublicCategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách danh mục đang hiển thị' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: category_response_dto_1.CategoryResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_public_category_dto_1.QueryPublicCategoryDto]),
    __metadata("design:returntype", void 0)
], PublicCategoriesController.prototype, "findVisible", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết danh mục đang hiển thị' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: category_response_dto_1.CategoryResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicCategoriesController.prototype, "findVisibleOne", null);
exports.PublicCategoriesController = PublicCategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('public/categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], PublicCategoriesController);
//# sourceMappingURL=public-categories.controller.js.map