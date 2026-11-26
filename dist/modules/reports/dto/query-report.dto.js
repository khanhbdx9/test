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
exports.QueryReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class QueryReportDto {
    from;
    to;
    topLimit = 10;
}
exports.QueryReportDto = QueryReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-11-01',
        description: 'Từ ngày (YYYY-MM-DD), lọc theo createdAt',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày bắt đầu (from) không hợp lệ' }),
    __metadata("design:type", String)
], QueryReportDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-11-30',
        description: 'Đến ngày (YYYY-MM-DD), lọc theo createdAt',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày kết thúc (to) không hợp lệ' }),
    __metadata("design:type", String)
], QueryReportDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10,
        minimum: 1,
        maximum: 50,
        description: 'Số sản phẩm bán chạy tối đa',
        default: 10,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'topLimit phải là số nguyên' }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], QueryReportDto.prototype, "topLimit", void 0);
//# sourceMappingURL=query-report.dto.js.map