"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const messages_1 = require("../constants/messages");
const NEST_DEFAULT_MESSAGES = new Set([
    'Bad Request',
    'Unauthorized',
    'Forbidden',
    'Not Found',
    'Conflict',
    'Internal Server Error',
]);
const CONNECTION_ERROR_CODES = new Set([
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',
    'P1000',
    'P1001',
    'P1017',
]);
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        const payload = this.toResponse(exception);
        if (payload.code >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(exception);
        }
        response.status(payload.code).json(payload);
    }
    toResponse(exception) {
        if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            return this.fromPrismaKnownError(exception);
        }
        if (exception instanceof client_1.Prisma.PrismaClientInitializationError) {
            return {
                code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: messages_1.MESSAGES.INTERNAL_ERROR,
                data: null,
            };
        }
        if (this.isConnectionError(exception)) {
            return {
                code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: messages_1.MESSAGES.INTERNAL_ERROR,
                data: null,
            };
        }
        if (exception instanceof common_1.HttpException) {
            return this.fromHttpException(exception);
        }
        if (this.isFileTooLarge(exception)) {
            return {
                code: common_1.HttpStatus.BAD_REQUEST,
                message: messages_1.MESSAGES.FILE_TOO_LARGE,
                data: null,
            };
        }
        return {
            code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: messages_1.MESSAGES.INTERNAL_ERROR,
            data: null,
        };
    }
    fromPrismaKnownError(exception) {
        switch (exception.code) {
            case 'P2025':
                return {
                    code: common_1.HttpStatus.NOT_FOUND,
                    message: messages_1.MESSAGES.NOT_FOUND,
                    data: null,
                };
            case 'P2002':
                return {
                    code: common_1.HttpStatus.CONFLICT,
                    message: messages_1.MESSAGES.CONFLICT,
                    data: null,
                };
            case 'P2003':
                return {
                    code: common_1.HttpStatus.BAD_REQUEST,
                    message: messages_1.MESSAGES.VALIDATION_ERROR,
                    data: null,
                };
            default:
                if (CONNECTION_ERROR_CODES.has(exception.code)) {
                    return {
                        code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        message: messages_1.MESSAGES.INTERNAL_ERROR,
                        data: null,
                    };
                }
                return {
                    code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: messages_1.MESSAGES.INTERNAL_ERROR,
                    data: null,
                };
        }
    }
    fromHttpException(exception) {
        const status = exception.getStatus();
        const body = exception.getResponse();
        const errors = this.extractFieldErrors(body);
        if (status === common_1.HttpStatus.BAD_REQUEST && errors) {
            return {
                code: status,
                message: messages_1.MESSAGES.VALIDATION_ERROR,
                data: { errors },
            };
        }
        return {
            code: status,
            message: this.resolveHttpMessage(status, body),
            data: null,
        };
    }
    extractFieldErrors(body) {
        if (typeof body !== 'object' || body === null) {
            return null;
        }
        const record = body;
        if (Array.isArray(record.errors) && this.isFieldErrorList(record.errors)) {
            return record.errors;
        }
        if (Array.isArray(record.message) && record.message.every((item) => typeof item === 'string')) {
            return record.message.map((message) => ({
                field: message.split(' ')[0] ?? 'unknown',
                message,
            }));
        }
        return null;
    }
    isFieldErrorList(value) {
        return value.every((item) => typeof item === 'object' &&
            item !== null &&
            typeof item.field === 'string' &&
            typeof item.message === 'string');
    }
    resolveHttpMessage(status, body) {
        if (status >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            return messages_1.MESSAGES.INTERNAL_ERROR;
        }
        const raw = this.readMessage(body);
        if (!raw || NEST_DEFAULT_MESSAGES.has(raw)) {
            return (0, messages_1.messageForStatus)(status);
        }
        return raw;
    }
    readMessage(body) {
        if (typeof body === 'string') {
            return body;
        }
        if (typeof body === 'object' && body !== null && 'message' in body) {
            const message = body.message;
            if (typeof message === 'string') {
                return message;
            }
        }
        return null;
    }
    isFileTooLarge(exception) {
        return (typeof exception === 'object' &&
            exception !== null &&
            'name' in exception &&
            exception.name === 'MulterError' &&
            'code' in exception &&
            exception.code === 'LIMIT_FILE_SIZE');
    }
    isConnectionError(exception) {
        if (typeof exception !== 'object' || exception === null || !('code' in exception)) {
            return false;
        }
        const code = exception.code;
        return typeof code === 'string' && CONNECTION_ERROR_CODES.has(code);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map