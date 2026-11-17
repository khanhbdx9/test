"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCanGrant = assertCanGrant;
exports.assertCanAssignRole = assertCanAssignRole;
exports.assertCanTouchSuperAdmin = assertCanTouchSuperAdmin;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../common/constants/messages");
const system_1 = require("../../common/constants/system");
function assertCanGrant(actor, permissionCodes) {
    const missing = permissionCodes.some((code) => !actor.role.permissions.includes(code));
    if (missing) {
        throw new common_1.ForbiddenException(messages_1.MESSAGES.PRIVILEGE_ESCALATION);
    }
}
function assertCanAssignRole(actor, roleCode, permissionCodes) {
    if (roleCode === system_1.SUPER_ADMIN_ROLE_CODE &&
        actor.role.code !== system_1.SUPER_ADMIN_ROLE_CODE) {
        throw new common_1.ForbiddenException(messages_1.MESSAGES.SUPER_ADMIN_PROTECTED);
    }
    assertCanGrant(actor, permissionCodes);
}
function assertCanTouchSuperAdmin(actor, targetRoleCode) {
    if (targetRoleCode === system_1.SUPER_ADMIN_ROLE_CODE &&
        actor.role.code !== system_1.SUPER_ADMIN_ROLE_CODE) {
        throw new common_1.ForbiddenException(messages_1.MESSAGES.SUPER_ADMIN_PROTECTED);
    }
}
//# sourceMappingURL=access.policy.js.map