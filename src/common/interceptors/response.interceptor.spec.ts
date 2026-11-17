import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of } from 'rxjs';
import { MESSAGES } from '../constants/messages';
import { ResponseInterceptor } from './response.interceptor';

function createContext(statusCode: number): ExecutionContext {
  return {
    switchToHttp: () => ({
      getResponse: () => ({ statusCode }),
      getRequest: () => ({}),
    }),
    getHandler: () => jest.fn(),
    getClass: () => class SampleController {},
  } as unknown as ExecutionContext;
}

describe('ResponseInterceptor', () => {
  const reflector = new Reflector();
  const interceptor = new ResponseInterceptor(reflector);

  it('bọc response thành công', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(createContext(200), {
        handle: () => of({ status: 'ok' }),
      }),
    );

    expect(result).toEqual({
      code: 200,
      message: MESSAGES.SUCCESS,
      data: { status: 'ok' },
    });
  });

  it('dùng message tạo mới khi status 201', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(createContext(201), {
        handle: () => of({ id: 1 }),
      }),
    );

    expect(result).toEqual({
      code: 201,
      message: MESSAGES.CREATED,
      data: { id: 1 },
    });
  });

  it('giữ cấu trúc phân trang trong data', async () => {
    const payload = {
      items: [{ id: 1 }],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };

    const result = await lastValueFrom(
      interceptor.intercept(createContext(200), {
        handle: () => of(payload),
      }),
    );

    expect(result.data).toEqual(payload);
    expect(result.code).toBe(200);
  });

  it('đổi dữ liệu rỗng thành null', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(createContext(200), {
        handle: () => of(undefined),
      }),
    );

    expect(result.data).toBeNull();
  });
});
