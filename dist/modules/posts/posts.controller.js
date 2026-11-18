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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const create_post_dto_1 = require("./dto/create-post.dto");
const post_response_dto_1 = require("./dto/post-response.dto");
const query_post_dto_1 = require("./dto/query-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const posts_service_1 = require("./posts.service");
let PostsController = class PostsController {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    findAll(query) {
        return this.postsService.findAll(query);
    }
    findOne(id) {
        return this.postsService.findOne(id);
    }
    create(user, dto) {
        return this.postsService.create(user.id, dto);
    }
    update(id, dto) {
        return this.postsService.update(id, dto);
    }
    publish(id) {
        return this.postsService.publish(id);
    }
    remove(id) {
        return this.postsService.remove(id);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('posts.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách bài viết' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_post_dto_1.QueryPostDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('posts.view'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết bài viết' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('posts.create'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo bài viết (content HTML CKEditor)' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: post_response_dto_1.PostResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('posts.update'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật bài viết' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, permissions_decorator_1.Permissions)('posts.publish'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.UPDATE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Xuất bản bài viết' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.UPDATE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('posts.delete'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.DELETE_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa mềm bài viết' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: post_response_dto_1.DeletedPostResponseDto,
        description: messages_1.MESSAGES.DELETE_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "remove", null);
exports.PostsController = PostsController = __decorate([
    (0, swagger_1.ApiTags)('Posts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map