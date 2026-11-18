"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSwaggerConfig = buildSwaggerConfig;
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function buildSwaggerConfig() {
    return new swagger_1.DocumentBuilder()
        .setTitle('Cake Shop API')
        .setDescription('API quản lý cửa hàng bánh sinh nhật')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('E2E Test', 'API dành cho khách hàng / storefront (không cần đăng nhập)')
        .build();
}
function setupSwagger(app) {
    const document = swagger_1.SwaggerModule.createDocument(app, buildSwaggerConfig());
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            tagsSorter: (a, b) => {
                if (a === 'Public')
                    return -1;
                if (b === 'Public')
                    return 1;
                return a.localeCompare(b);
            },
            operationsSorter: 'alpha',
        },
    });
}
//# sourceMappingURL=swagger.setup.js.map