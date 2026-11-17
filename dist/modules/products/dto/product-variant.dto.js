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
exports.ProductVariantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("../../../generated/prisma/client");
const MONEY = /^\d{1,10}(\.\d{1,2})?$/;
class ProductVariantDto {
    sku;
    size;
    style;
    price;
    salePrice;
    status;
    sortOrder;
}
exports.ProductVariantDto = ProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BK-DAU-16' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'SKU biến thể không được để trống' }),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '16cm' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Kích thước không được để trống' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dâu' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Mẫu bánh không được để trống' }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '250000' }),
    (0, class_validator_1.Matches)(MONEY, { message: 'Giá bán không hợp lệ' }),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '220000', nullable: true }),
    (0, class_validator_1.ValidateIf)((_, value) => value !== null && value !== undefined),
    (0, class_validator_1.Matches)(MONEY, { message: 'Giá khuyến mãi không hợp lệ' }),
    __metadata("design:type", Object)
], ProductVariantDto.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.VariantStatus, default: client_1.VariantStatus.ACTIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.VariantStatus, { message: 'Trạng thái biến thể không hợp lệ' }),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=product-variant.dto.js.map