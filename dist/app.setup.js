"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = configureApp;
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const node_path_1 = require("node:path");
const swagger_setup_1 = require("./config/swagger.setup");
function configureApp(app) {
    const configService = app.get(config_1.ConfigService);
    const nodeEnv = configService.get('nodeEnv');
    app.setGlobalPrefix('api/v1');
    app.useStaticAssets((0, node_path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads',
    });
    app.use((0, helmet_1.default)());
    if (nodeEnv !== 'production') {
        app.enableCors();
    }
    (0, swagger_setup_1.setupSwagger)(app);
}
//# sourceMappingURL=app.setup.js.map