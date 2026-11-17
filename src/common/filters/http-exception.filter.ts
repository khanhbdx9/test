import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';
import { MESSAGES, messageForStatus } from '../constants/messages';
import {
  ApiResponse,
  FieldError,
  ValidationErrorData,
} from '../interfaces/api-response.interface';

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

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const payload = this.toResponse(exception);

    if (payload.code >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    response.status(payload.code).json(payload);
  }

  private toResponse(exception: unknown): ApiResponse<ValidationErrorData | null> {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.fromPrismaKnownError(exception);
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: MESSAGES.INTERNAL_ERROR,
        data: null,
      };
    }

    if (this.isConnectionError(exception)) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: MESSAGES.INTERNAL_ERROR,
        data: null,
      };
    }

    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }

    if (this.isFileTooLarge(exception)) {
      return {
        code: HttpStatus.BAD_REQUEST,
        message: MESSAGES.FILE_TOO_LARGE,
        data: null,
      };
    }

    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MESSAGES.INTERNAL_ERROR,
      data: null,
    };
  }

  private fromPrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): ApiResponse<null> {
    switch (exception.code) {
      case 'P2025':
        return {
          code: HttpStatus.NOT_FOUND,
          message: MESSAGES.NOT_FOUND,
          data: null,
        };
      case 'P2002':
        return {
          code: HttpStatus.CONFLICT,
          message: MESSAGES.CONFLICT,
          data: null,
        };
      case 'P2003':
        return {
          code: HttpStatus.BAD_REQUEST,
          message: MESSAGES.VALIDATION_ERROR,
          data: null,
        };
      default:
        if (CONNECTION_ERROR_CODES.has(exception.code)) {
          return {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: MESSAGES.INTERNAL_ERROR,
            data: null,
          };
        }

        return {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: MESSAGES.INTERNAL_ERROR,
          data: null,
        };
    }
  }

  private fromHttpException(
    exception: HttpException,
  ): ApiResponse<ValidationErrorData | null> {
    const status = exception.getStatus();
    const body = exception.getResponse();
    const errors = this.extractFieldErrors(body);

    if (status === HttpStatus.BAD_REQUEST && errors) {
      return {
        code: status,
        message: MESSAGES.VALIDATION_ERROR,
        data: { errors },
      };
    }

    return {
      code: status,
      message: this.resolveHttpMessage(status, body),
      data: null,
    };
  }

  private extractFieldErrors(body: unknown): FieldError[] | null {
    if (typeof body !== 'object' || body === null) {
      return null;
    }

    const record = body as { errors?: unknown; message?: unknown };

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

  private isFieldErrorList(value: unknown[]): value is FieldError[] {
    return value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as FieldError).field === 'string' &&
        typeof (item as FieldError).message === 'string',
    );
  }

  private resolveHttpMessage(status: number, body: unknown): string {
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return MESSAGES.INTERNAL_ERROR;
    }

    const raw = this.readMessage(body);
    if (!raw || NEST_DEFAULT_MESSAGES.has(raw)) {
      return messageForStatus(status);
    }

    return raw;
  }

  private readMessage(body: unknown): string | null {
    if (typeof body === 'string') {
      return body;
    }

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return null;
  }

  private isFileTooLarge(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'name' in exception &&
      exception.name === 'MulterError' &&
      'code' in exception &&
      exception.code === 'LIMIT_FILE_SIZE'
    );
  }

  private isConnectionError(exception: unknown): boolean {
    if (typeof exception !== 'object' || exception === null || !('code' in exception)) {
      return false;
    }

    const code = (exception as { code?: unknown }).code;
    return typeof code === 'string' && CONNECTION_ERROR_CODES.has(code);
  }
}
