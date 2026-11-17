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
exports.DeletedProductResponseDto = exports.ProductResponseDto = exports.ProductVariantResponseDto = exports.ProductImageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("../../../generated/prisma/client");
class ProductImageResponseDto {
    id;
    url;
    alt;
    sortOrder;
    isCover;
}
exports.ProductImageResponseDto = ProductImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductImageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductImageResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ProductImageResponseDto.prototype, "alt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductImageResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductImageResponseDto.prototype, "isCover", void 0);
class ProductVariantResponseDto {
    id;
    sku;
    size;
    style;
    price;
    salePrice;
    status;
    sortOrder;
}
exports.ProductVariantResponseDto = ProductVariantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '250000.00' }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '220000.00' }),
    __metadata("design:type", Object)
], ProductVariantResponseDto.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.VariantStatus }),
    __metadata("design:type", String)
], ProductVariantResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProductVariantResponseDto.prototype, "sortOrder", void 0);
class ProductResponseDto {
    id;
    categoryId;
    categorySlug;
    categoryName;
    sku;
    name;
    slug;
    shortDescription;
    description;
    price;
    salePrice;
    status;
    isFeatured;
    isBestSeller;
    seoTitle;
    seoDescription;
    images;
    variants;
    createdAt;
    updatedAt;
}
exports.ProductResponseDto = ProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "categorySlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '250000.00' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '220000.00' }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ProductStatus }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isBestSeller", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "seoTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "seoDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductImageResponseDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductVariantResponseDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "updatedAt", void 0);
class DeletedProductResponseDto {
    id;
}
exports.DeletedProductResponseDto = DeletedProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeletedProductResponseDto.prototype, "id", void 0);
//# sourceMappingURL=product-response.dto.js.map