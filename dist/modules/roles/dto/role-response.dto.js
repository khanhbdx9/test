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
exports.DeletedRoleResponseDto = exports.RolePermissionsResponseDto = exports.RoleDetailResponseDto = exports.PermissionResponseDto = exports.RoleResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RoleResponseDto {
    id;
    code;
    name;
    description;
    isSystem;
    createdAt;
    updatedAt;
}
exports.RoleResponseDto = RoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MANAGER' }),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RoleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], RoleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], RoleResponseDto.prototype, "isSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RoleResponseDto.prototype, "updatedAt", void 0);
class PermissionResponseDto {
    id;
    code;
    module;
    action;
    description;
}
exports.PermissionResponseDto = PermissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'users.view' }),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PermissionResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], PermissionResponseDto.prototype, "description", void 0);
class RoleDetailResponseDto extends RoleResponseDto {
    permissions;
}
exports.RoleDetailResponseDto = RoleDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PermissionResponseDto] }),
    __metadata("design:type", Array)
], RoleDetailResponseDto.prototype, "permissions", void 0);
class RolePermissionsResponseDto {
    permissions;
}
exports.RolePermissionsResponseDto = RolePermissionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PermissionResponseDto] }),
    __metadata("design:type", Array)
], RolePermissionsResponseDto.prototype, "permissions", void 0);
class DeletedRoleResponseDto {
    id;
}
exports.DeletedRoleResponseDto = DeletedRoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeletedRoleResponseDto.prototype, "id", void 0);
//# sourceMappingURL=role-response.dto.js.map