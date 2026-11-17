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
exports.LogoutResponseDto = exports.LoginResponseDto = exports.TokenResponseDto = exports.MeResponseDto = exports.AuthRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("../../../generated/prisma/client");
class AuthRoleDto {
    id;
    code;
    name;
}
exports.AuthRoleDto = AuthRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthRoleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SUPER_ADMIN' }),
    __metadata("design:type", String)
], AuthRoleDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthRoleDto.prototype, "name", void 0);
class MeResponseDto {
    id;
    email;
    fullName;
    status;
    role;
    permissions;
}
exports.MeResponseDto = MeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MeResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MeResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.UserStatus }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AuthRoleDto }),
    __metadata("design:type", AuthRoleDto)
], MeResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], MeResponseDto.prototype, "permissions", void 0);
class TokenResponseDto {
    accessToken;
    refreshToken;
    expiresIn;
}
exports.TokenResponseDto = TokenResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '15m' }),
    __metadata("design:type", String)
], TokenResponseDto.prototype, "expiresIn", void 0);
class LoginResponseDto extends TokenResponseDto {
    user;
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: MeResponseDto }),
    __metadata("design:type", MeResponseDto)
], LoginResponseDto.prototype, "user", void 0);
class LogoutResponseDto {
    revoked;
}
exports.LogoutResponseDto = LogoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LogoutResponseDto.prototype, "revoked", void 0);
//# sourceMappingURL=auth-response.dto.js.map