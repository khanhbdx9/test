import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { MESSAGES, messageForStatus } from '../constants/messages';
import { PaginationMetaDto } from '../dto/api-response.dto';

interface StandardResponseOptions<T> {
  type?: Type<T>;
  description?: string;
  status?: number;
}

function envelopeSchema(
  status: number,
  data: Record<string, unknown>,
): Record<string, unknown> {
  return {
    type: 'object',
    required: ['code', 'message', 'data'],
    properties: {
      code: { type: 'number', example: status },
      message: { type: 'string', example: messageForStatus(status) },
      data,
    },
  };
}

export function ApiStandardResponse<T>(
  options: StandardResponseOptions<T> = {},
): MethodDecorator {
  const status = options.status ?? 200;
  const dataSchema: Record<string, unknown> = options.type
    ? { $ref: getSchemaPath(options.type) }
    : { nullable: true, example: null };

  return applyDecorators(
    ...(options.type ? [ApiExtraModels(options.type)] : []),
    ApiResponse({
      status,
      description: options.description ?? messageForStatus(status),
      schema: envelopeSchema(status, dataSchema),
    }),
  );
}

export function ApiStandardArrayResponse<T>(options: {
  type: Type<T>;
  description?: string;
  status?: number;
}): MethodDecorator {
  const status = options.status ?? 200;

  return applyDecorators(
    ApiExtraModels(options.type),
    ApiResponse({
      status,
      description: options.description ?? messageForStatus(status),
      schema: envelopeSchema(status, {
        type: 'array',
        items: { $ref: getSchemaPath(options.type) },
      }),
    }),
  );
}

export function ApiStandardPaginatedResponse<T>(options: {
  type: Type<T>;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(options.type, PaginationMetaDto),
    ApiResponse({
      status: 200,
      description: options.description ?? MESSAGES.SUCCESS,
      schema: envelopeSchema(200, {
        type: 'object',
        required: ['items', 'pagination'],
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(options.type) },
          },
          pagination: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      }),
    }),
  );
}

function errorSchema(
  status: number,
  message: string,
  data: Record<string, unknown>,
): Record<string, unknown> {
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

export function ApiStandardErrorResponse(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: MESSAGES.VALIDATION_ERROR,
      schema: errorSchema(400, MESSAGES.VALIDATION_ERROR, {
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
    }),
    ApiResponse({
      status: 401,
      description: MESSAGES.UNAUTHORIZED,
      schema: errorSchema(401, MESSAGES.UNAUTHORIZED, {
        nullable: true,
        example: null,
      }),
    }),
    ApiResponse({
      status: 403,
      description: MESSAGES.FORBIDDEN,
      schema: errorSchema(403, MESSAGES.FORBIDDEN, {
        nullable: true,
        example: null,
      }),
    }),
    ApiResponse({
      status: 404,
      description: MESSAGES.NOT_FOUND,
      schema: errorSchema(404, MESSAGES.NOT_FOUND, {
        nullable: true,
        example: null,
      }),
    }),
    ApiResponse({
      status: 500,
      description: MESSAGES.INTERNAL_ERROR,
      schema: errorSchema(500, MESSAGES.INTERNAL_ERROR, {
        nullable: true,
        example: null,
      }),
    }),
  );
}
