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
exports.ReportDashboardDto = exports.TopProductDto = exports.RevenueByMonthDto = exports.RevenueByDayDto = exports.OrdersByStatusDto = exports.ReportSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("../../../generated/prisma/client");
class ReportSummaryDto {
    totalRevenue;
    totalOrders;
    completedOrders;
    averageOrderValue;
}
exports.ReportSummaryDto = ReportSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1500000.00', description: 'Doanh thu đơn COMPLETED' }),
    __metadata("design:type", String)
], ReportSummaryDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tổng số đơn trong khoảng (mọi status)' }),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số đơn COMPLETED' }),
    __metadata("design:type", Number)
], ReportSummaryDto.prototype, "completedOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '750000.00',
        description: 'Doanh thu trung bình / đơn COMPLETED',
    }),
    __metadata("design:type", String)
], ReportSummaryDto.prototype, "averageOrderValue", void 0);
class OrdersByStatusDto {
    status;
    count;
}
exports.OrdersByStatusDto = OrdersByStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.OrderStatus }),
    __metadata("design:type", String)
], OrdersByStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrdersByStatusDto.prototype, "count", void 0);
class RevenueByDayDto {
    date;
    revenue;
    orders;
}
exports.RevenueByDayDto = RevenueByDayDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-24' }),
    __metadata("design:type", String)
], RevenueByDayDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '450000.00' }),
    __metadata("design:type", String)
], RevenueByDayDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RevenueByDayDto.prototype, "orders", void 0);
class RevenueByMonthDto {
    month;
    revenue;
    orders;
}
exports.RevenueByMonthDto = RevenueByMonthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11' }),
    __metadata("design:type", String)
], RevenueByMonthDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1500000.00' }),
    __metadata("design:type", String)
], RevenueByMonthDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RevenueByMonthDto.prototype, "orders", void 0);
class TopProductDto {
    productId;
    productName;
    productSku;
    quantity;
    revenue;
}
exports.TopProductDto = TopProductDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TopProductDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TopProductDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TopProductDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TopProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '900000.00' }),
    __metadata("design:type", String)
], TopProductDto.prototype, "revenue", void 0);
class ReportDashboardDto {
    summary;
    ordersByStatus;
    revenueByDay;
    revenueByMonth;
    topProducts;
}
exports.ReportDashboardDto = ReportDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReportSummaryDto }),
    __metadata("design:type", ReportSummaryDto)
], ReportDashboardDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrdersByStatusDto] }),
    __metadata("design:type", Array)
], ReportDashboardDto.prototype, "ordersByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RevenueByDayDto] }),
    __metadata("design:type", Array)
], ReportDashboardDto.prototype, "revenueByDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RevenueByMonthDto] }),
    __metadata("design:type", Array)
], ReportDashboardDto.prototype, "revenueByMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TopProductDto] }),
    __metadata("design:type", Array)
], ReportDashboardDto.prototype, "topProducts", void 0);
//# sourceMappingURL=report-response.dto.js.map