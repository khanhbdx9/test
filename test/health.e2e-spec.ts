import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { MESSAGES } from '../src/common/constants/messages';
import { buildSwaggerConfig } from '../src/config/swagger.setup';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        enableShutdownHooks: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health trả format chuẩn', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: MESSAGES.FETCH_SUCCESS,
      data: { status: 'ok' },
    });
  });

  it('Swagger mô tả response bọc ngoài', () => {
    const document = SwaggerModule.createDocument(app, buildSwaggerConfig());
    const okResponse = document.paths['/api/v1/health']?.get?.responses?.['200'];
    const serialized = JSON.stringify(okResponse);

    expect(okResponse).toBeDefined();
    expect(serialized).toContain('"code"');
    expect(serialized).toContain('"message"');
    expect(serialized).toContain('"data"');
    expect(document.info.title).toBe('Cake Shop API');
    expect(document.info.version).toBe('1.0');
    expect(document.components?.securitySchemes).toBeDefined();
  });
});
