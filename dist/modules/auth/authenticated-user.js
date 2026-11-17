"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserSelect = void 0;
exports.mapAuthenticatedUser = mapAuthenticatedUser;
exports.authUserSelect = {
    id: true,
    email: true,
    fullName: true,
    status: true,
    deletedAt: true,
    passwordHash: true,
    role: {
        select: {
            id: true,
            code: true,
            name: true,
            isSystem: true,
            permissions: {
                select: {
                    permission: {
                        select: { code: true },
                    },
                },
            },
        },
    },
};
function mapAuthenticatedUser(user) {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        role: {
            id: user.role.id,
            code: user.role.code,
            name: user.role.name,
            isSystem: user.role.isSystem,
            permissions: user.role.permissions.map((item) => item.permission.code),
        },
    };
}
//# sourceMappingURL=authenticated-user.js.map