"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const nestjs_pino_1 = require("nestjs-pino");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const permissions_guard_1 = require("./common/guards/permissions.guard");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const validation_pipe_1 = require("./common/pipes/validation.pipe");
const configuration_1 = require("./config/configuration");
const env_validation_1 = require("./config/env.validation");
const prisma_module_1 = require("./database/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const banners_module_1 = require("./modules/banners/banners.module");
const categories_module_1 = require("./modules/categories/categories.module");
const health_module_1 = require("./modules/health/health.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const orders_module_1 = require("./modules/orders/orders.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const posts_module_1 = require("./modules/posts/posts.module");
const products_module_1 = require("./modules/products/products.module");
const public_module_1 = require("./modules/public/public.module");
const system_configs_module_1 = require("./modules/system-configs/system-configs.module");
const themes_module_1 = require("./modules/themes/themes.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const roles_module_1 = require("./modules/roles/roles.module");
const users_module_1 = require("./modules/users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                ignoreEnvFile: process.env.NODE_ENV === 'production',
                load: [configuration_1.configuration],
                validationSchema: env_validation_1.envValidationSchema,
            }),
            nestjs_pino_1.LoggerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const nodeEnv = configService.get('nodeEnv');
                    return {
                        pinoHttp: {
                            level: nodeEnv === 'test' ? 'silent' : 'info',
                            redact: ['req.headers.authorization'],
                            transport: nodeEnv === 'development'
                                ? {
                                    target: 'pino-pretty',
                                    options: { singleLine: true, colorize: true },
                                }
                                : undefined,
                        },
                    };
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    skipIf: () => configService.get('nodeEnv') === 'test',
                    throttlers: [{ name: 'default', ttl: 60_000, limit: 10 }],
                }),
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            notifications_module_1.NotificationsModule,
            posts_module_1.PostsModule,
            themes_module_1.ThemesModule,
            banners_module_1.BannersModule,
            public_module_1.PublicModule,
            system_configs_module_1.SystemConfigsModule,
            uploads_module_1.UploadsModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
        ],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useValue: (0, validation_pipe_1.createValidationPipe)(),
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map