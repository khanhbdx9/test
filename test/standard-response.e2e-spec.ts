import {
  Body,
  Controller,
  Get,
  HttpCode,
  INestApplication,
  Module,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { IsNotEmpty, IsString } from 'class-validator';
import request from 'supertest';
import { MESSAGES } from '../src/common/constants/messages';
import { ResponseMessage } from '../src/common/decorators/response-message.decorator';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { createValidationPipe } from '../src/common/pipes/validation.pipe';

class CreateSampleDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name!: string;
}

@Controller('samples')
class SampleController {
  @Post()
  @HttpCode(201)
  @ResponseMessage(MESSAGES.CREATED)
  create(@Body() body: CreateSampleDto): { name: string } {
    return { name: body.name };
  }

  @Get('missing')
  missing(): never {
    throw new NotFoundException();
  }

  @Get('boom')
  boom(): never {
    throw new Error('secret-internal-detail');
  }

  @Get()
  list(): {
    items: { id: number }[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } {
    return {
      items: [{ id: 1 }],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
  }
}

@Module({
  controllers: [SampleController],
  providers: [
    { provide: APP_PIPE, useValue: createValidationPipe() },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
class SampleModule {}

describe('Standard response (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [SampleModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('trả 201 đúng format', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/samples')
      .send({ name: 'Bánh kem' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      code: 201,
      message: MESSAGES.CREATED,
      data: { name: 'Bánh kem' },
    });
  });

  it('trả lỗi validation đúng format và HTTP status trùng code', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/samples')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe(MESSAGES.VALIDATION_ERROR);
    expect(response.body.data.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'name',
          message: 'Tên không được để trống',
        }),
      ]),
    );
  });

  it('từ chối field không được khai báo', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/samples')
      .send({ name: 'Bánh kem', extra: true });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe(400);
    expect(response.body.data.errors[0].field).toBe('extra');
  });

  it('trả 404 đúng format', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/samples/missing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 404,
      message: MESSAGES.NOT_FOUND,
      data: null,
    });
  });

  it('trả 500 không lộ chi tiết nội bộ', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/samples/boom');
    const serialized = JSON.stringify(response.body);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 500,
      message: MESSAGES.INTERNAL_ERROR,
      data: null,
    });
    expect(serialized).not.toContain('secret-internal-detail');
    expect(serialized).not.toContain('stack');
  });

  it('giữ phân trang trong data', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/samples');

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.data).toEqual({
      items: [{ id: 1 }],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });
});
