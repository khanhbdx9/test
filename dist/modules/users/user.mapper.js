"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicUserSelect = void 0;
exports.mapUserResponse = mapUserResponse;
exports.publicUserSelect = {
    id: true,
    email: true,
    fullName: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    role: {
        select: {
            id: true,
            code: true,
            name: true,
        },
    },
};
function mapUserResponse(user) {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        role: {
            id: user.role.id,
            code: user.role.code,
            name: user.role.name,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
//# sourceMappingURL=user.mapper.js.map