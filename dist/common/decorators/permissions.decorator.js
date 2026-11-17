"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyPermissions = exports.Permissions = exports.ANY_PERMISSIONS_KEY = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
exports.ANY_PERMISSIONS_KEY = 'any_permissions';
const Permissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.Permissions = Permissions;
const AnyPermissions = (...permissions) => (0, common_1.SetMetadata)(exports.ANY_PERMISSIONS_KEY, permissions);
exports.AnyPermissions = AnyPermissions;
//# sourceMappingURL=permissions.decorator.js.map