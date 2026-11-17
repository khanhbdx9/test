import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'node:path';
import { setupSwagger } from './config/swagger.setup';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('nodeEnv');

  app.setGlobalPrefix('api/v1');
  (app as NestExpressApplication).useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });
  app.use(helmet());

  if (nodeEnv !== 'production') {
    app.enableCors();
  }

  setupSwagger(app);
}
