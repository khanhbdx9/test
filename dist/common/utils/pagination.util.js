"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPagination = buildPagination;
function buildPagination(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    };
}
//# sourceMappingURL=pagination.util.js.map