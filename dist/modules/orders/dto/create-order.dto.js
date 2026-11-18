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
exports.CreateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("../../../generated/prisma/client");
class CreateOrderDto {
    productIds;
    email;
    phone;
    shippingAddress;
    fullName;
    note;
    paymentMethod;
    paymentImageUrl;
    deliveryDate;
    deliveryTime;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['11111111-1111-4111-8111-111111111111'],
        description: 'Danh sách id sản phẩm; backend lấy giá từ DB để tính tổng',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Đơn hàng cần ít nhất một sản phẩm' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Id sản phẩm không hợp lệ' }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "productIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'khach@example.com' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0901234567' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Số điện thoại không hợp lệ' }),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Nguyễn Huệ, Q.1, TP.HCM' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Địa chỉ giao hàng không được để trống' }),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Nguyễn Văn A' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentMethod, example: client_1.PaymentMethod.AT_STORE }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://cdn.example.com/uploads/orders/transfer.jpg',
    }),
    (0, class_validator_1.ValidateIf)((_, value) => value !== null && value !== undefined),
    (0, class_validator_1.IsUrl)({ require_protocol: true }, { message: 'Ảnh chuyển khoản phải là URL hợp lệ' }),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", Object)
], CreateOrderDto.prototype, "paymentImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-11-20',
        description: 'Bắt buộc khi thanh toán chuyển khoản',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.paymentMethod === client_1.PaymentMethod.BANK_TRANSFER &&
        o.deliveryDate !== undefined &&
        o.deliveryDate !== null &&
        o.deliveryDate !== ''),
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày giao hàng không hợp lệ' }),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "deliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '09:00-11:00' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim() : value),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "deliveryTime", void 0);
//# sourceMappingURL=create-order.dto.js.map