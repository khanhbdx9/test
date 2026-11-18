import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Cake Shop API')
    .setDescription('API quản lý cửa hàng bánh sinh nhật')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('E2E Test', 'API dành cho khách hàng / storefront (không cần đăng nhập)')
    .build();
}

export function setupSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(app, buildSwaggerConfig());
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => {
        if (a === 'Public') return -1;
        if (b === 'Public') return 1;
        return a.localeCompare(b);
      },
      operationsSorter: 'alpha',
    },
  });
}
