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
exports.PublicSearchResponseDto = exports.PublicSearchSuggestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const api_response_dto_1 = require("../../../common/dto/api-response.dto");
const category_response_dto_1 = require("../../categories/dto/category-response.dto");
const post_response_dto_1 = require("../../posts/dto/post-response.dto");
const product_response_dto_1 = require("../../products/dto/product-response.dto");
class PublicSearchSuggestionDto {
    type;
    id;
    label;
    slug;
}
exports.PublicSearchSuggestionDto = PublicSearchSuggestionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicSearchSuggestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicSearchSuggestionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicSearchSuggestionDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], PublicSearchSuggestionDto.prototype, "slug", void 0);
class PublicSearchResponseDto {
    query;
    products;
    pagination;
    categories;
    posts;
    suggestions;
}
exports.PublicSearchResponseDto = PublicSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bánh kem' }),
    __metadata("design:type", String)
], PublicSearchResponseDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [product_response_dto_1.ProductResponseDto] }),
    __metadata("design:type", Array)
], PublicSearchResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: api_response_dto_1.PaginationMetaDto }),
    __metadata("design:type", api_response_dto_1.PaginationMetaDto)
], PublicSearchResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [category_response_dto_1.CategoryResponseDto],
        description: 'Danh mục khớp từ khóa (tối đa 8)',
    }),
    __metadata("design:type", Array)
], PublicSearchResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [post_response_dto_1.PostResponseDto],
        description: 'Bài viết khớp từ khóa (tối đa 5)',
    }),
    __metadata("design:type", Array)
], PublicSearchResponseDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PublicSearchSuggestionDto] }),
    __metadata("design:type", Array)
], PublicSearchResponseDto.prototype, "suggestions", void 0);
//# sourceMappingURL=public-search-response.dto.js.map