import { INestApplication } from '@nestjs/common';
export declare function buildSwaggerConfig(): Omit<import("@nestjs/swagger").OpenAPIObject, "paths">;
export declare function setupSwagger(app: INestApplication): void;
