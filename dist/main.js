"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
const app_setup_1 = require("./app.setup");
const prisma_service_1 = require("./database/prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    (0, app_setup_1.configureApp)(app);
    app.get(prisma_service_1.PrismaService).enableShutdownHooks(app);
    const port = app.get(config_1.ConfigService).getOrThrow('port');
    await app.listen(port, '0.0.0.0');
}
bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map