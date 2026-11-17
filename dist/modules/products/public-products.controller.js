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
exports.PublicProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const product_response_dto_1 = require("./dto/product-response.dto");
const query_public_product_dto_1 = require("./dto/query-public-product.dto");
const products_service_1 = require("./products.service");
let PublicProductsController = class PublicProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findPublished(query) {
        return this.productsService.findPublished(query);
    }
    findRelated(categorySlug, productSlug, query) {
        return this.productsService.findRelated(categorySlug, productSlug, query);
    }
    findPublishedBySlug(categorySlug, productSlug) {
        return this.productsService.findPublishedBySlug(categorySlug, productSlug);
    }
};
exports.PublicProductsController = PublicProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Danh sách sản phẩm đã xuất bản, ưu tiên nổi bật rồi mới tạo',
    }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_public_product_dto_1.QueryPublicProductDto]),
    __metadata("design:returntype", void 0)
], PublicProductsController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)(':categorySlug/:productSlug/related'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Sản phẩm liên quan cùng danh mục' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Param)('productSlug')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_public_product_dto_1.QueryRelatedProductDto]),
    __metadata("design:returntype", void 0)
], PublicProductsController.prototype, "findRelated", null);
__decorate([
    (0, common_1.Get)(':categorySlug/:productSlug'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết sản phẩm theo danh mục và slug' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Param)('productSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PublicProductsController.prototype, "findPublishedBySlug", null);
exports.PublicProductsController = PublicProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('public/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], PublicProductsController);
//# sourceMappingURL=public-products.controller.js.map