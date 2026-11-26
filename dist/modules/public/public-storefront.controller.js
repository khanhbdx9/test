"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicStorefrontController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const messages_1 = require("../../common/constants/messages");
const api_standard_response_decorator_1 = require("../../common/decorators/api-standard-response.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const response_message_decorator_1 = require("../../common/decorators/response-message.decorator");
const banners_service_1 = require("../banners/banners.service");
const banner_response_dto_1 = require("../banners/dto/banner-response.dto");
const query_banner_dto_1 = require("../banners/dto/query-banner.dto");
const categories_service_1 = require("../categories/categories.service");
const category_response_dto_1 = require("../categories/dto/category-response.dto");
const query_public_category_dto_1 = require("../categories/dto/query-public-category.dto");
const create_order_dto_1 = require("../orders/dto/create-order.dto");
const order_response_dto_1 = require("../orders/dto/order-response.dto");
const orders_service_1 = require("../orders/orders.service");
const post_response_dto_1 = require("../posts/dto/post-response.dto");
const query_post_dto_1 = require("../posts/dto/query-post.dto");
const posts_service_1 = require("../posts/posts.service");
const product_response_dto_1 = require("../products/dto/product-response.dto");
const query_public_product_dto_1 = require("../products/dto/query-public-product.dto");
const products_service_1 = require("../products/products.service");
const system_config_keys_1 = require("../system-configs/system-config.keys");
const system_config_response_dto_1 = require("../system-configs/dto/system-config-response.dto");
const system_configs_service_1 = require("../system-configs/system-configs.service");
const theme_response_dto_1 = require("../themes/dto/theme-response.dto");
const themes_service_1 = require("../themes/themes.service");
const image_file_1 = require("../uploads/image-file");
const upload_image_response_dto_1 = require("../uploads/dto/upload-image-response.dto");
const upload_path_1 = require("../uploads/upload-path");
const uploads_service_1 = require("../uploads/uploads.service");
const public_filter_response_dto_1 = require("./dto/public-filter-response.dto");
const public_filter_dto_1 = require("./dto/public-filter.dto");
const public_filter_service_1 = require("./public-filter.service");
let PublicStorefrontController = class PublicStorefrontController {
    categoriesService;
    productsService;
    ordersService;
    themesService;
    bannersService;
    postsService;
    publicFilterService;
    systemConfigsService;
    uploadsService;
    constructor(categoriesService, productsService, ordersService, themesService, bannersService, postsService, publicFilterService, systemConfigsService, uploadsService) {
        this.categoriesService = categoriesService;
        this.productsService = productsService;
        this.ordersService = ordersService;
        this.themesService = themesService;
        this.bannersService = bannersService;
        this.postsService = postsService;
        this.publicFilterService = publicFilterService;
        this.systemConfigsService = systemConfigsService;
        this.uploadsService = uploadsService;
    }
    findCategories(query) {
        return this.categoriesService.findVisible(query);
    }
    findCategoryProducts(categorySlug, query) {
        return this.productsService.findPublishedByCategory(categorySlug, query);
    }
    findCategory(id) {
        return this.categoriesService.findVisibleOne(id);
    }
    findProducts(query) {
        return this.productsService.findPublished(query);
    }
    findRelatedOtherCategoryProducts(categorySlug) {
        return this.productsService.findRelatedOtherCategories(categorySlug);
    }
    findRelatedProducts(categorySlug, productSlug, query) {
        return this.productsService.findRelated(categorySlug, productSlug, query);
    }
    findProduct(categorySlug, productSlug) {
        return this.productsService.findPublishedBySlug(categorySlug, productSlug);
    }
    filter(dto) {
        return this.publicFilterService.filter(dto);
    }
    createOrder(dto) {
        return this.ordersService.createPublic(dto);
    }
    findPaymentQrConfig() {
        return this.systemConfigsService.findByKey(system_config_keys_1.SYSTEM_CONFIG_KEYS.QR_PAYMENT);
    }
    uploadPaymentQrImages(files, request) {
        const protocol = request.get('x-forwarded-proto') ?? request.protocol;
        return this.uploadsService.saveImages(files, `${protocol}://${request.get('host')}`, (0, upload_path_1.paymentQrUploadFolder)());
    }
    findActiveTheme() {
        return this.themesService.findActive();
    }
    findActiveBanners(query) {
        return this.bannersService.findActive(query);
    }
    findPosts(query) {
        return this.postsService.findPublished(query);
    }
    findRelatedPosts(slug, query) {
        return this.postsService.findRelated(slug, query);
    }
    findPost(slug) {
        return this.postsService.findPublishedBySlug(slug);
    }
};
exports.PublicStorefrontController = PublicStorefrontController;
__decorate([
    (0, common_1.Get)('categories'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách danh mục đang hiển thị' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: category_response_dto_1.CategoryResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_public_category_dto_1.QueryPublicCategoryDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findCategories", null);
__decorate([
    (0, common_1.Get)('categories/:categorySlug/products'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Danh sách sản phẩm theo categorySlug (phân trang, tìm kiếm tên/SKU/slug)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_public_product_dto_1.QueryPublicCategoryProductDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findCategoryProducts", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết danh mục đang hiển thị' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: category_response_dto_1.CategoryResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findCategory", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Danh sách sản phẩm đã xuất bản, ưu tiên nổi bật rồi mới tạo',
    }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_public_product_dto_1.QueryPublicProductDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findProducts", null);
__decorate([
    (0, common_1.Get)('products/:categorySlug/related-other'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Tối đa 10 sản phẩm từ các danh mục khác categorySlug (mỗi category ≥1 nếu có)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('categorySlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findRelatedOtherCategoryProducts", null);
__decorate([
    (0, common_1.Get)('products/:categorySlug/:productSlug/related'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Sản phẩm liên quan cùng danh mục' }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Param)('productSlug')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_public_product_dto_1.QueryRelatedProductDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findRelatedProducts", null);
__decorate([
    (0, common_1.Get)('products/:categorySlug/:productSlug'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết sản phẩm theo danh mục và slug' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: product_response_dto_1.ProductResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('categorySlug')),
    __param(1, (0, common_1.Param)('productSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findProduct", null);
__decorate([
    (0, common_1.Post)('filter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Lọc storefront (sản phẩm phân trang; search, categoryId, giá, sort theo cột)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: public_filter_response_dto_1.PublicFilterResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [public_filter_dto_1.PublicFilterDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "filter", null);
__decorate([
    (0, common_1.Post)('orders/create'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Khách tạo đơn hàng' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: order_response_dto_1.OrderResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('p-con/qr'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Lấy cấu hình QR thanh toán (system_configs.QR_PAYMENT)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: system_config_response_dto_1.SystemConfigResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findPaymentQrConfig", null);
__decorate([
    (0, common_1.Post)('upload/qr/pay'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload ảnh chứng từ thanh toán vào folder payments/qr (chỉ ảnh)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['files'],
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    }),
    (0, api_standard_response_decorator_1.ApiStandardArrayResponse)({
        type: upload_image_response_dto_1.UploadImageResponseDto,
        status: 201,
        description: messages_1.MESSAGES.CREATED,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', image_file_1.MAX_UPLOAD_FILES, {
        limits: { fileSize: image_file_1.MAX_TOTAL_UPLOAD_BYTES },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "uploadPaymentQrImages", null);
__decorate([
    (0, common_1.Get)('theme'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Theme đang active trên hệ thống' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: theme_response_dto_1.ThemeResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findActiveTheme", null);
__decorate([
    (0, common_1.Get)('banners'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách banner đang hoạt động' }),
    (0, api_standard_response_decorator_1.ApiStandardArrayResponse)({
        type: banner_response_dto_1.BannerResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_banner_dto_1.QueryPublicBannerDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findActiveBanners", null);
__decorate([
    (0, common_1.Get)('posts'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Danh sách bài viết đã xuất bản (search tên, sortCreated, landing)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_post_dto_1.QueryPublicPostDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findPosts", null);
__decorate([
    (0, common_1.Get)('posts/:slug/related'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Bài viết liên quan (theo từ khóa tiêu đề, fallback bài mới)',
    }),
    (0, api_standard_response_decorator_1.ApiStandardPaginatedResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_post_dto_1.QueryRelatedPostDto]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findRelatedPosts", null);
__decorate([
    (0, common_1.Get)('posts/:slug'),
    (0, response_message_decorator_1.ResponseMessage)(messages_1.MESSAGES.FETCH_SUCCESS),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết bài viết đã xuất bản theo slug' }),
    (0, api_standard_response_decorator_1.ApiStandardResponse)({
        type: post_response_dto_1.PostResponseDto,
        description: messages_1.MESSAGES.FETCH_SUCCESS,
    }),
    (0, api_standard_response_decorator_1.ApiStandardErrorResponse)(),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicStorefrontController.prototype, "findPost", null);
exports.PublicStorefrontController = PublicStorefrontController = __decorate([
    (0, swagger_1.ApiTags)('Public'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('public'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        products_service_1.ProductsService,
        orders_service_1.OrdersService,
        themes_service_1.ThemesService,
        banners_service_1.BannersService,
        posts_service_1.PostsService,
        public_filter_service_1.PublicFilterService,
        system_configs_service_1.SystemConfigsService,
        uploads_service_1.UploadsService])
], PublicStorefrontController);
//# sourceMappingURL=public-storefront.controller.js.map