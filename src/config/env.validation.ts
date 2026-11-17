import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .pattern(/^postgres(ql)?:\/\//)
    .required(),
  DATABASE_URL_TEST: Joi.string()
    .pattern(/^postgres(ql)?:\/\//)
    .optional(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+(s|m|h|d)$/)
    .required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .pattern(/^\d+(s|m|h|d)$/)
    .required(),
});
