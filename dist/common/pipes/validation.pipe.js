"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenValidationErrors = flattenValidationErrors;
exports.createValidationPipe = createValidationPipe;
const common_1 = require("@nestjs/common");
const messages_1 = require("../constants/messages");
function flattenValidationErrors(errors, parent = '') {
    const result = [];
    for (const error of errors) {
        const field = parent ? `${parent}.${error.property}` : error.property;
        if (error.constraints) {
            const message = Object.values(error.constraints)[0];
            if (message) {
                result.push({ field, message });
            }
        }
        if (error.children && error.children.length > 0) {
            result.push(...flattenValidationErrors(error.children, field));
        }
    }
    return result;
}
function createValidationPipe() {
    return new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => new common_1.BadRequestException({
            message: messages_1.MESSAGES.VALIDATION_ERROR,
            errors: flattenValidationErrors(errors),
        }),
    });
}
//# sourceMappingURL=validation.pipe.js.map