"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigsModule = void 0;
const common_1 = require("@nestjs/common");
const system_configs_controller_1 = require("./system-configs.controller");
const system_configs_service_1 = require("./system-configs.service");
let SystemConfigsModule = class SystemConfigsModule {
};
exports.SystemConfigsModule = SystemConfigsModule;
exports.SystemConfigsModule = SystemConfigsModule = __decorate([
    (0, common_1.Module)({
        controllers: [system_configs_controller_1.SystemConfigsController],
        providers: [system_configs_service_1.SystemConfigsService],
        exports: [system_configs_service_1.SystemConfigsService],
    })
], SystemConfigsModule);
//# sourceMappingURL=system-configs.module.js.map