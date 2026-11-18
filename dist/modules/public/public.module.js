"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicModule = void 0;
const common_1 = require("@nestjs/common");
const banners_module_1 = require("../banners/banners.module");
const categories_module_1 = require("../categories/categories.module");
const orders_module_1 = require("../orders/orders.module");
const posts_module_1 = require("../posts/posts.module");
const products_module_1 = require("../products/products.module");
const themes_module_1 = require("../themes/themes.module");
const public_filter_service_1 = require("./public-filter.service");
const public_storefront_controller_1 = require("./public-storefront.controller");
let PublicModule = class PublicModule {
};
exports.PublicModule = PublicModule;
exports.PublicModule = PublicModule = __decorate([
    (0, common_1.Module)({
        imports: [
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            themes_module_1.ThemesModule,
            banners_module_1.BannersModule,
            posts_module_1.PostsModule,
        ],
        controllers: [public_storefront_controller_1.PublicStorefrontController],
        providers: [public_filter_service_1.PublicFilterService],
    })
], PublicModule);
//# sourceMappingURL=public.module.js.map