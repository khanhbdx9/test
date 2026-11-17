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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const assign_role_dto_1 = require("./dto/assign-role.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const query_user_dto_1 = require("./dto/query-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(query) {
        return this.usersService.findAll(query);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    create(actor, dto) {
        return this.usersService.create(actor, dto);
    }
    update(actor, id, dto) {
        return this.usersService.update(actor, id, dto);
    }
    lock(actor, id) {
        return this.usersService.lock(actor, id);
    }
    unlock(actor, id) {
        return this.usersService.unlock(actor, id);
    }
    assignRole(actor, id, dto) {
        return this.usersService.assignRole(actor, id, dto);
    }
    remove(actor, id) {
        return this.usersService.remove(actor, id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('users.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách người dùng' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({ type: user_response_dto_1.UserResponseDto, description: messages_1.MESSAGES.FETCH_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_user_dto_1.QueryUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('users.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết người dùng' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.UserResponseDto, description: messages_1.MESSAGES.FETCH_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('users.create'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo tài khoản' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.UserResponseDto, status: 201, description: messages_1.MESSAGES.CREATED }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('users.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật tài khoản' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.UserResponseDto, description: messages_1.MESSAGES.UPDATE_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/lock'),
    (0, permissions_decorator_1.Permissions)('users.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Khóa tài khoản' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.UserResponseDto, description: messages_1.MESSAGES.UPDATE_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "lock", null);
__decorate([
    (0, common_1.Patch)(':id/unlock'),
    (0, permissions_decorator_1.Permissions)('users.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Mở khóa tài khoản' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.UserResponseDto, description: messages_1.MESSAGES.UPDATE_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "unlock", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, permissions_decorator_1.Permissions)('users.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Gán role cho người dùng' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.UserResponseDto, description: messages_1.MESSAGES.UPDATE_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, assign_role_dto_1.AssignRoleDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('users.delete'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.DELETE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa mềm tài khoản' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({ type: user_response_dto_1.DeletedUserResponseDto, description: messages_1.MESSAGES.DELETE_SUCCESS }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map