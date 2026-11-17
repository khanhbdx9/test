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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const create_product_dto_1 = require("./dto/create-product.dto");
const product_response_dto_1 = require("./dto/product-response.dto");
const query_product_dto_1 = require("./dto/query-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const products_service_1 = require("./products.service");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll(query) {
        return this.productsService.findAll(query);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    create(dto) {
        return this.productsService.create(dto);
    }
    update(id, dto) {
        return this.productsService.update(id, dto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('products.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách sản phẩm' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_product_dto_1.QueryProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('products.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết sản phẩm' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('products.create'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo sản phẩm' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: product_response_dto_1.ProductResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('products.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật sản phẩm' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('products.delete'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.DELETE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa sản phẩm' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: product_response_dto_1.DeletedProductResponseDto,
        description: messages_1.MESSAGES.DELETE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map