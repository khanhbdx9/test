import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { MESSAGES } from '../constants/messages';
import { HttpExceptionFilter } from './http-exception.filter';

function capture(exception: unknown): { statusCode: number; body: unknown } {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status, json }),
      getRequest: () => ({}),
    }),
  } as unknown as ArgumentsHost;

  new HttpExceptionFilter().catch(exception, host);

  return {
    statusCode: status.mock.calls[0][0] as number,
    body: json.mock.calls[0][0],
  };
}

describe('HttpExceptionFilter', () => {
  it('định dạng lỗi validation', () => {
    const result = capture(
      new BadRequestException({
        message: MESSAGES.VALIDATION_ERROR,
        errors: [{ field: 'name', message: 'Tên không được để trống' }],
      }),
    );

    expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(result.body).toEqual({
      code: 400,
      message: MESSAGES.VALIDATION_ERROR,
      data: {
        errors: [{ field: 'name', message: 'Tên không được để trống' }],
      },
    });
  });

  it('định dạng không tìm thấy dữ liệu', () => {
    const result = capture(new NotFoundException());

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      code: 404,
      message: MESSAGES.NOT_FOUND,
      data: null,
    });
  });

  it('không trả stack trace khi lỗi hệ thống', () => {
    const result = capture(new Error('secret-internal-detail'));
    const serialized = JSON.stringify(result.body);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual({
      code: 500,
      message: MESSAGES.INTERNAL_ERROR,
      data: null,
    });
    expect(serialized).not.toContain('secret-internal-detail');
    expect(serialized).not.toContain('stack');
  });

  it('map lỗi Prisma không tìm thấy bản ghi', () => {
    const result = capture(
      new Prisma.PrismaClientKnownRequestError('not found', {
        code: 'P2025',
        clientVersion: 'test',
      }),
    );

    expect(result.body).toEqual({
      code: 404,
      message: MESSAGES.NOT_FOUND,
      data: null,
    });
  });

  it('map lỗi Prisma unique', () => {
    const result = capture(
      new Prisma.PrismaClientKnownRequestError('unique', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    expect(result.body).toEqual({
      code: 409,
      message: MESSAGES.CONFLICT,
      data: null,
    });
  });

  it('map lỗi kết nối cơ sở dữ liệu', () => {
    const result = capture(
      new Prisma.PrismaClientKnownRequestError('connection', {
        code: 'P1001',
        clientVersion: 'test',
      }),
    );

    expect(result.body).toEqual({
      code: 500,
      message: MESSAGES.INTERNAL_ERROR,
      data: null,
    });
  });
});
