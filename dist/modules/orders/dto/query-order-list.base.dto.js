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
exports.QueryOrderListBaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class QueryOrderListBaseDto {
    page;
    limit;
    createdFrom;
    createdTo;
    deliveryDate;
    deliveryTime;
    search;
}
exports.QueryOrderListBaseDto = QueryOrderListBaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'page phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'page tối thiểu là 1' }),
    __metadata("design:type", Number)
], QueryOrderListBaseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, minimum: 1, maximum: 100 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'limit phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'limit tối thiểu là 1' }),
    (0, class_validator_1.Max)(100, { message: 'limit tối đa là 100' }),
    __metadata("design:type", Number)
], QueryOrderListBaseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-11-01',
        description: 'Lọc createdAt từ ngày (YYYY-MM-DD), bắt buộc',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày bắt đầu (createdFrom) không hợp lệ' }),
    __metadata("design:type", String)
], QueryOrderListBaseDto.prototype, "createdFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-11-22',
        description: 'Lọc createdAt đến ngày (YYYY-MM-DD), bắt buộc',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày kết thúc (createdTo) không hợp lệ' }),
    __metadata("design:type", String)
], QueryOrderListBaseDto.prototype, "createdTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-11-20' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày giao hàng không hợp lệ' }),
    __metadata("design:type", String)
], QueryOrderListBaseDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '09:00-11:00' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], QueryOrderListBaseDto.prototype, "deliveryTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tìm theo số điện thoại hoặc email',
    }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], QueryOrderListBaseDto.prototype, "search", void 0);
//# sourceMappingURL=query-order-list.base.dto.js.map