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
exports.QueryOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("../../../generated/prisma/client");
const query_order_list_base_dto_1 = require("./query-order-list.base.dto");
class QueryOrderDto extends query_order_list_base_dto_1.QueryOrderListBaseDto {
    status;
}
exports.QueryOrderDto = QueryOrderDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.OrderStatus,
        isArray: true,
        description: 'Lọc nhiều trạng thái, ví dụ status=CONFIRMED&status=COMPLETED',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        return Array.isArray(value) ? value : [value];
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.OrderStatus, { each: true, message: 'Trạng thái không hợp lệ' }),
    __metadata("design:type", Array)
], QueryOrderDto.prototype, "status", void 0);
//# sourceMappingURL=query-order.dto.js.map