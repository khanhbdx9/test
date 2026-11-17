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
        .build();
}
function setupSwagger(app) {
    const document = swagger_1.SwaggerModule.createDocument(app, buildSwaggerConfig());
    swagger_1.SwaggerModule.setup('api/docs', app, document);
}
//# sourceMappingURL=swagger.setup.js.map