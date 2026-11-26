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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const query_report_dto_1 = require("./dto/query-report.dto");
const report_response_dto_1 = require("./dto/report-response.dto");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboard(query) {
        return this.reportsService.getDashboard(query);
    }
    getRevenue(query) {
        return this.reportsService.getDashboard(query);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Tổng hợp dữ liệu biểu đồ/báo cáo (doanh thu COMPLETED, trạng thái, top SP)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: report_response_dto_1.ReportDashboardDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_report_dto_1.QueryReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, permissions_decorator_1.Permissions)('reports.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Alias dashboard — dữ liệu doanh thu và vận hành cửa hàng',
    }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: report_response_dto_1.ReportDashboardDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_report_dto_1.QueryReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenue", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map