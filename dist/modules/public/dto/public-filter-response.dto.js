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
exports.PublicFilterResponseDto = exports.PublicFilterSuggestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const api_response_dto_1 = require("../../../common/dto/api-response.dto");
const category_response_dto_1 = require("../../categories/dto/category-response.dto");
const post_response_dto_1 = require("../../posts/dto/post-response.dto");
const product_response_dto_1 = require("../../products/dto/product-response.dto");
class PublicFilterSuggestionDto {
    type;
    id;
    label;
    slug;
}
exports.PublicFilterSuggestionDto = PublicFilterSuggestionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicFilterSuggestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicFilterSuggestionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PublicFilterSuggestionDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], PublicFilterSuggestionDto.prototype, "slug", void 0);
class PublicFilterResponseDto {
    search;
    products;
    pagination;
    categories;
    posts;
    suggestions;
}
exports.PublicFilterResponseDto = PublicFilterResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        nullable: true,
        example: 'bánh kem',
        description: 'Từ khóa search đã áp dụng (null nếu không truyền)',
    }),
    __metadata("design:type", Object)
], PublicFilterResponseDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [product_response_dto_1.ProductResponseDto] }),
    __metadata("design:type", Array)
], PublicFilterResponseDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: api_response_dto_1.PaginationMetaDto }),
    __metadata("design:type", api_response_dto_1.PaginationMetaDto)
], PublicFilterResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [category_response_dto_1.CategoryResponseDto],
        description: 'Danh mục khớp từ khóa (tối đa 8; rỗng nếu không có search)',
    }),
    __metadata("design:type", Array)
], PublicFilterResponseDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [post_response_dto_1.PostResponseDto],
        description: 'Bài viết khớp từ khóa (tối đa 5; rỗng nếu không có search)',
    }),
    __metadata("design:type", Array)
], PublicFilterResponseDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PublicFilterSuggestionDto] }),
    __metadata("design:type", Array)
], PublicFilterResponseDto.prototype, "suggestions", void 0);
//# sourceMappingURL=public-filter-response.dto.js.map