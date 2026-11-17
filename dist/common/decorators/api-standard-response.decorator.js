"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStandardResponse = ApiStandardResponse;
exports.ApiStandardArrayResponse = ApiStandardArrayResponse;
exports.ApiStandardPaginatedResponse = ApiStandardPaginatedResponse;
exports.ApiStandardErrorResponse = ApiStandardErrorResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../constants/messages");
const api_response_dto_1 = require("../dto/api-response.dto");
function envelopeSchema(status, data) {
    return {
        type: 'object',
        required: ['code', 'message', 'data'],
        properties: {
            code: { type: 'number', example: status },
            message: { type: 'string', example: (0, messages_1.messageForStatus)(status) },
            data,
        },
    };
}
function ApiStandardResponse(options = {}) {
    const status = options.status ?? 200;
    const dataSchema = options.type
        ? { $ref: (0, swagger_1.getSchemaPath)(options.type) }
        : { nullable: true, example: null };
    return (0, common_1.applyDecorators)(...(options.type ? [(0, swagger_1.ApiExtraModels)(options.type)] : []), (0, swagger_1.ApiResponse)({
        status,
        description: options.description ?? (0, messages_1.messageForStatus)(status),
        schema: envelopeSchema(status, dataSchema),
    }));
}
function ApiStandardArrayResponse(options) {
    const status = options.status ?? 200;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(options.type), (0, swagger_1.ApiResponse)({
        status,
        description: options.description ?? (0, messages_1.messageForStatus)(status),
        schema: envelopeSchema(status, {
            type: 'array',
            items: { $ref: (0, swagger_1.getSchemaPath)(options.type) },
        }),
    }));
}
function ApiStandardPaginatedResponse(options) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(options.type, api_response_dto_1.PaginationMetaDto), (0, swagger_1.ApiResponse)({
        status: 200,
        description: options.description ?? messages_1.MESSAGES.SUCCESS,
        schema: envelopeSchema(200, {
            type: 'object',
            required: ['items', 'pagination'],
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(options.type) },
                },
                pagination: { $ref: (0, swagger_1.getSchemaPath)(api_response_dto_1.PaginationMetaDto) },
            },
        }),
    }));
}
function errorSchema(status, message, data) {
    return {
        type: 'object',
        required: ['code', 'message', 'data'],
        properties: {
            code: { type: 'number', example: status },
            message: { type: 'string', example: message },
            data,
        },
    };
}
function ApiStandardErrorResponse() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 400,
        description: messages_1.MESSAGES.VALIDATION_ERROR,
        schema: errorSchema(400, messages_1.MESSAGES.VALIDATION_ERROR, {
            type: 'object',
            properties: {
                errors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['field', 'message'],
                        properties: {
                            field: { type: 'string', example: 'name' },
                            message: { type: 'string', example: 'Tên không được để trống' },
                        },
                    },
                },
            },
        }),
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: messages_1.MESSAGES.UNAUTHORIZED,
        schema: errorSchema(401, messages_1.MESSAGES.UNAUTHORIZED, {
            nullable: true,
            example: null,
        }),
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: messages_1.MESSAGES.FORBIDDEN,
        schema: errorSchema(403, messages_1.MESSAGES.FORBIDDEN, {
            nullable: true,
            example: null,
        }),
    }), (0, swagger_1.ApiResponse)({
        status: 404,
        description: messages_1.MESSAGES.NOT_FOUND,
        schema: errorSchema(404, messages_1.MESSAGES.NOT_FOUND, {
            nullable: true,
            example: null,
        }),
    }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: messages_1.MESSAGES.INTERNAL_ERROR,
        schema: errorSchema(500, messages_1.MESSAGES.INTERNAL_ERROR, {
            nullable: true,
            example: null,
        }),
    }));
}
//# sourceMappingURL=api-standard-response.decorator.js.map