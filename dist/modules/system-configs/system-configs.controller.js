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
exports.SystemConfigsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const create_system_config_dto_1 = require("./dto/create-system-config.dto");
const query_system_config_dto_1 = require("./dto/query-system-config.dto");
const system_config_response_dto_1 = require("./dto/system-config-response.dto");
const update_system_config_dto_1 = require("./dto/update-system-config.dto");
const system_configs_service_1 = require("./system-configs.service");
let SystemConfigsController = class SystemConfigsController {
    systemConfigsService;
    constructor(systemConfigsService) {
        this.systemConfigsService = systemConfigsService;
    }
    findAll(query) {
        return this.systemConfigsService.findAll(query);
    }
    findOne(id) {
        return this.systemConfigsService.findOne(id);
    }
    create(dto) {
        return this.systemConfigsService.create(dto);
    }
    update(id, dto) {
        return this.systemConfigsService.update(id, dto);
    }
    remove(id) {
        return this.systemConfigsService.remove(id);
    }
};
exports.SystemConfigsController = SystemConfigsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('system-configs.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách cấu hình hệ thống' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: system_config_response_dto_1.SystemConfigResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_system_config_dto_1.QuerySystemConfigDto]),
    __metadata("design:returntype", void 0)
], SystemConfigsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('system-configs.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết cấu hình' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: system_config_response_dto_1.SystemConfigResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SystemConfigsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('system-configs.create'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo cấu hình' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: system_config_response_dto_1.SystemConfigResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_system_config_dto_1.CreateSystemConfigDto]),
    __metadata("design:returntype", void 0)
], SystemConfigsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('system-configs.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật cấu hình' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: system_config_response_dto_1.SystemConfigResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_system_config_dto_1.UpdateSystemConfigDto]),
    __metadata("design:returntype", void 0)
], SystemConfigsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('system-configs.delete'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.DELETE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa cấu hình' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: system_config_response_dto_1.DeletedSystemConfigResponseDto,
        description: messages_1.MESSAGES.DELETE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SystemConfigsController.prototype, "remove", null);
exports.SystemConfigsController = SystemConfigsController = __decorate([
    (0, swagger_1.ApiTags)('System configs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('system-configs'),
    __metadata("design:paramtypes", [system_configs_service_1.SystemConfigsService])
], SystemConfigsController);
//# sourceMappingURL=system-configs.controller.js.map