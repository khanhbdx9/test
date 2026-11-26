"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.envValidationSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: joi_1.default.number().port().default(3000),
    DATABASE_URL: joi_1.default.string()
        .pattern(/^postgres(ql)?:\/\//)
        .required(),
    JWT_SECRET: joi_1.default.string().min(16).required(),
    JWT_EXPIRES_IN: joi_1.default.string()
        .pattern(/^\d+(s|m|h|d)$/)
        .required(),
    JWT_REFRESH_SECRET: joi_1.default.string().min(16).required(),
    JWT_REFRESH_EXPIRES_IN: joi_1.default.string()
        .pattern(/^\d+(s|m|h|d)$/)
        .required(),
    MAIL_ENABLED: joi_1.default.string().valid('true', 'false').optional(),
    MAIL_TRANSPORT: joi_1.default.string().valid('smtp', 'gmail-api').optional(),
    SMTP_HOST: joi_1.default.string().optional(),
    SMTP_PORT: joi_1.default.number().port().optional(),
    SMTP_USER: joi_1.default.string().optional(),
    SMTP_PASS: joi_1.default.string().optional(),
    SMTP_FROM: joi_1.default.string().optional(),
    GMAIL_CLIENT_ID: joi_1.default.string().optional(),
    GMAIL_CLIENT_SECRET: joi_1.default.string().optional(),
    GMAIL_REFRESH_TOKEN: joi_1.default.string().optional(),
});
//# sourceMappingURL=env.validation.js.map