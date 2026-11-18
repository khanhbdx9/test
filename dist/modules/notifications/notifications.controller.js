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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const bulk_read_notifications_dto_1 = require("./dto/bulk-read-notifications.dto");
const notification_response_dto_1 = require("./dto/notification-response.dto");
const query_notification_dto_1 = require("./dto/query-notification.dto");
const notifications_service_1 = require("./notifications.service");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(user, query) {
        return this.notificationsService.findAll(user.id, query);
    }
    unreadCount(user) {
        return this.notificationsService.unreadCount(user.id);
    }
    findOne(user, id) {
        return this.notificationsService.findOne(user.id, id);
    }
    markRead(user, id) {
        return this.notificationsService.markRead(user.id, id);
    }
    markUnread(user, id) {
        return this.notificationsService.markUnread(user.id, id);
    }
    bulkRead(user, dto) {
        return this.notificationsService.bulkRead(user.id, dto);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('notifications.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách thông báo của tôi' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: notification_response_dto_1.NotificationResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_notification_dto_1.QueryNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, permissions_decorator_1.Permissions)('notifications.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Số thông báo chưa đọc' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: notification_response_dto_1.UnreadCountResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "unreadCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('notifications.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết thông báo' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: notification_response_dto_1.NotificationResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, permissions_decorator_1.Permissions)('notifications.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Đánh dấu đã đọc' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: notification_response_dto_1.NotificationResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markRead", null);
__decorate([
    (0, common_1.Patch)(':id/unread'),
    (0, permissions_decorator_1.Permissions)('notifications.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Đánh dấu chưa đọc' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: notification_response_dto_1.NotificationResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markUnread", null);
__decorate([
    (0, common_1.Post)('bulk-read'),
    (0, permissions_decorator_1.Permissions)('notifications.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Đánh dấu đã đọc hàng loạt' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: notification_response_dto_1.BulkReadResultDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bulk_read_notifications_dto_1.BulkReadNotificationsDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "bulkRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map