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
exports.PaginationMetaDto = exports.ValidationErrorDataDto = exports.FieldErrorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FieldErrorDto {
    field;
    message;
}
exports.FieldErrorDto = FieldErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'name' }),
    __metadata("design:type", String)
], FieldErrorDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tên không được để trống' }),
    __metadata("design:type", String)
], FieldErrorDto.prototype, "message", void 0);
class ValidationErrorDataDto {
    errors;
}
exports.ValidationErrorDataDto = ValidationErrorDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FieldErrorDto] }),
    __metadata("design:type", Array)
], ValidationErrorDataDto.prototype, "errors", void 0);
class PaginationMetaDto {
    page;
    limit;
    total;
    totalPages;
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
//# sourceMappingURL=api-response.dto.js.map