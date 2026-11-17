import { ValidationError, ValidationPipe } from '@nestjs/common';
import { FieldError } from '../interfaces/api-response.interface';
export declare function flattenValidationErrors(errors: ValidationError[], parent?: string): FieldError[];
export declare function createValidationPipe(): ValidationPipe;
