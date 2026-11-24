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
exports.QueryOrderHistoryDto = exports.ORDER_HISTORY_STATUSES = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("../../../generated/prisma/client");
const query_order_list_base_dto_1 = require("./query-order-list.base.dto");
exports.ORDER_HISTORY_STATUSES = [
    client_1.OrderStatus.REJECTED,
    client_1.OrderStatus.COMPLETED,
];
class QueryOrderHistoryDto extends query_order_list_base_dto_1.QueryOrderListBaseDto {
    status;
}
exports.QueryOrderHistoryDto = QueryOrderHistoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: exports.ORDER_HISTORY_STATUSES,
        isArray: true,
        description: 'Chỉ REJECTED hoặc COMPLETED. Bỏ trống = cả hai. Ví dụ status=COMPLETED',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        return Array.isArray(value) ? value : [value];
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsIn)([...exports.ORDER_HISTORY_STATUSES], {
        each: true,
        message: 'Trạng thái lịch sử chỉ nhận REJECTED hoặc COMPLETED',
    }),
    __metadata("design:type", Array)
], QueryOrderHistoryDto.prototype, "status", void 0);
//# sourceMappingURL=query-order-history.dto.js.map