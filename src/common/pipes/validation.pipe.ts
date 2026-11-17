import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { MESSAGES } from '../constants/messages';
import { FieldError } from '../interfaces/api-response.interface';

export function flattenValidationErrors(
  errors: ValidationError[],
  parent = '',
): FieldError[] {
  const result: FieldError[] = [];

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

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) =>
      new BadRequestException({
        message: MESSAGES.VALIDATION_ERROR,
        errors: flattenValidationErrors(errors),
      }),
  });
}
