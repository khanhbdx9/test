# MASTER PROMPT: BUILD CAKE SHOP MANAGEMENT SYSTEM BACKEND

## 1. ROLE & OBJECTIVE

Bạn là Senior Backend Engineer / Software Architect có kinh nghiệm chuyên sâu về Node.js, NestJS, TypeScript, PostgreSQL và Prisma ORM.

Nhiệm vụ: Thiết kế và xây dựng một Backend API hoàn chỉnh cho hệ thống quản lý cửa hàng bánh sinh nhật (Cake Shop Management System).

Hệ thống phục vụ:
- Admin quản trị cửa hàng.
- Manager quản lý hoạt động kinh doanh.
- Staff xử lý đơn hàng.
- Content Editor quản lý nội dung website.
- Frontend Website kết nối thông qua RESTful API.

Yêu cầu source code:
- Kiến trúc rõ ràng, dễ mở rộng, dễ bảo trì.
- Phân chia module độc lập.
- Có chuẩn coding convention thống nhất.
- Có xử lý Authentication, Authorization.
- Có Swagger Documentation.
- Có chuẩn API Response thống nhất.
- Có Docker và Database Migration.
- Có Unit Test và Integration Test.
- Không viết toàn bộ logic vào Controller.
- Không hardcode dữ liệu nghiệp vụ trong code.

## 2. TECHNOLOGY STACK

Sử dụng các công nghệ sau:

| Technology | Requirement |
|---|---|
| Runtime | Node.js 22 |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Authentication | JWT + Passport |
| Authorization | RBAC |
| Validation | class-validator + class-transformer |
| API Documentation | Swagger / OpenAPI |
| Password Hashing | bcrypt |
| Logging | nestjs-pino |
| Container | Docker + Docker Compose |
| Testing | Jest |
| Configuration | @nestjs/config |

Sử dụng các phiên bản package tương thích với Node.js 22 và NestJS tại thời điểm triển khai.

## 3. ARCHITECTURE

Sử dụng kiến trúc Modular Monolith.

Các nguyên tắc:
- Mỗi Business Module chịu trách nhiệm một nghiệp vụ.
- Controller chỉ xử lý HTTP Request/Response.
- Service xử lý Business Logic.
- DTO xử lý Request Validation.
- Prisma chịu trách nhiệm truy vấn Database.
- Common chứa các thành phần dùng chung.
- Database Module quản lý kết nối Prisma.
- Không để các module phụ thuộc vòng tròn.
- Hạn chế phụ thuộc chéo giữa các module.
- Có thể mở rộng thành Microservices trong tương lai nhưng không triển khai Microservices ở giai đoạn hiện tại.

## 4. PROJECT STRUCTURE

Tổ chức source code theo cấu trúc:

cake-shop-backend/

├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   ├── pipes/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── constants/
│   │   └── utils/
│   │
│   ├── config/
│   │
│   ├── database/
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── categories/
│   │   ├── products/
│   │   ├── posts/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── reports/
│   │   ├── themes/
│   │   ├── banners/
│   │   └── uploads/
│   │
│   └── shared/
│
├── test/
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md

Mỗi module nghiệp vụ nên có:

- module.ts
- controller.ts
- service.ts
- dto/
- entities/ (nếu thực sự cần)

Không tạo các abstraction hoặc layer không cần thiết.

## 5. BUSINESS MODULES

### 5.1. Authentication Module

Chức năng:
- Login bằng email và password.
- Logout.
- JWT Authentication.
- Access Token.
- Refresh Token.
- Lấy thông tin tài khoản hiện tại.
- Kiểm tra trạng thái tài khoản.
- Hash password bằng bcrypt.
- Không trả password hoặc password hash trong API.

### 5.2. User Management

Chức năng:
- Danh sách người dùng.
- Tạo tài khoản.
- Cập nhật tài khoản.
- Xóa mềm tài khoản.
- Khóa / mở khóa tài khoản.
- Gán Role cho User.
- Tìm kiếm, lọc, phân trang.

### 5.3. Role Management

Chức năng:
- Danh sách Role.
- Tạo Role.
- Cập nhật Role.
- Xóa Role.
- Gán Permission cho Role.
- Xem danh sách Permission của Role.
- Kiểm tra Role đang được sử dụng trước khi xóa.
- Không cho phép sửa hoặc xóa Role hệ thống được bảo vệ.

Role mặc định:

- SUPER_ADMIN
- ADMIN
- MANAGER
- STAFF
- CONTENT_EDITOR

Cho phép Admin tạo thêm Role tùy chỉnh.

### 5.4. Permission Management

Sử dụng mô hình RBAC:

User -> Role -> Role Permissions -> Permissions.

Permission code theo cấu trúc:

module.action

Ví dụ:

- users.view
- users.create
- users.update
- users.delete
- roles.view
- roles.create
- roles.update
- roles.delete
- products.view
- products.create
- products.update
- products.delete
- categories.view
- categories.create
- categories.update
- categories.delete
- orders.view
- orders.create
- orders.update
- orders.cancel
- reports.view
- reports.export
- banners.view
- banners.manage
- themes.view
- themes.manage
- posts.view
- posts.create
- posts.update
- posts.delete
- posts.publish

Yêu cầu:
- Permission được lưu trong Database.
- Không hardcode danh sách quyền trong Business Logic.
- Seed các Permission mặc định.
- Admin có thể tạo Role và phân quyền.
- Backend kiểm tra quyền trên từng API.
- Không chỉ dựa vào việc ẩn hoặc hiện button ở Frontend.
- Không cho phép User tự gán quyền cao hơn quyền hiện tại.
- SUPER_ADMIN là tài khoản hệ thống được bảo vệ.
- Có cơ chế bảo vệ quyền quản trị hệ thống.

Sử dụng:
- Permissions Decorator.
- Permissions Guard.
- JWT Auth Guard.
- Reflector để đọc Permission metadata.

Ví dụ:

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('products.create')
@Post()
create() {}

Đối với dữ liệu cần giới hạn theo chi nhánh hoặc phạm vi quản lý, thiết kế có khả năng bổ sung Data Scope sau này.

### 5.5. Category Management

Chức năng:
- CRUD danh mục.
- Danh mục cha/con.
- Slug.
- Mô tả.
- Hình ảnh.
- Trạng thái hiển thị.
- Thứ tự sắp xếp.
- SEO metadata.
- Không xóa danh mục đang có sản phẩm liên kết nếu chưa xử lý quan hệ.

### 5.6. Product Management

Chức năng:
- CRUD sản phẩm.
- Mã sản phẩm SKU.
- Tên sản phẩm.
- Slug.
- Mô tả ngắn.
- Mô tả chi tiết.
- Danh mục.
- Giá bán.
- Giá khuyến mãi.
- Hình ảnh sản phẩm.
- Nhiều hình ảnh cho một sản phẩm.
- Trạng thái sản phẩm.
- Sản phẩm nổi bật.
- Sản phẩm bán chạy.
- SEO metadata.

Product Variants:
- Kích thước bánh.
- Mẫu bánh.
- Giá theo từng biến thể.
- SKU riêng.
- Trạng thái biến thể.

Ví dụ:
- Bánh kem dâu 16cm.
- Bánh kem dâu 20cm.
- Bánh kem dâu 24cm.

Không thiết kế cứng kích thước bánh trong code.

### 5.7. Post Management

Chức năng:
- CRUD bài viết.
- Tiêu đề.
- Slug.
- Thumbnail.
- Nội dung.
- Mô tả ngắn.
- Danh mục bài viết.
- Trạng thái Draft / Published.
- Lịch xuất bản nếu cần.
- SEO Title.
- SEO Description.
- Người tạo bài viết.

### 5.8. Customer Management

Chức năng:
- Quản lý khách hàng.
- Họ tên.
- Email.
- Số điện thoại.
- Địa chỉ.
- Lịch sử mua hàng.
- Tìm kiếm khách hàng.

### 5.9. Order Management

Chức năng:
- Tạo đơn hàng.
- Danh sách đơn hàng.
- Chi tiết đơn hàng.
- Cập nhật thông tin đơn hàng.
- Cập nhật trạng thái.
- Hủy đơn hàng.
- Lịch sử thay đổi trạng thái.
- Thông tin khách hàng.
- Thông tin nhận bánh.
- Địa chỉ giao hàng.
- Thời gian nhận bánh.
- Ghi chú đơn hàng.
- Tổng tiền.
- Phương thức thanh toán.
- Trạng thái thanh toán.

Order Status đề xuất:
- PENDING
- CONFIRMED
- PREPARING
- READY
- SHIPPING
- COMPLETED
- CANCELLED

Yêu cầu quan trọng:
- Lưu snapshot tên sản phẩm, SKU, giá và biến thể trong Order Item tại thời điểm đặt hàng.
- Không phụ thuộc giá sản phẩm hiện tại.
- Tính toán tổng tiền ở Backend.
- Không tin tưởng giá tiền do Frontend gửi lên.
- Sử dụng Database Transaction khi tạo đơn.
- Có lịch sử thay đổi trạng thái.
- Kiểm tra quy tắc chuyển trạng thái đơn hàng.
- Xử lý chống tạo đơn trùng khi cần bằng idempotency key.

### 5.10. Report Management

Chức năng:
- Báo cáo doanh thu.
- Tổng số đơn hàng.
- Số đơn hàng theo trạng thái.
- Sản phẩm bán chạy.
- Doanh thu theo ngày.
- Doanh thu theo tháng.
- Doanh thu theo khoảng thời gian.
- Bộ lọc ngày bắt đầu / ngày kết thúc.
- Export Excel nếu được triển khai ở giai đoạn mở rộng.

Thống nhất rõ cách tính doanh thu, ví dụ chỉ tính đơn hàng COMPLETED và đã thanh toán, không tính đơn bị hủy.

### 5.11. Theme Management

Chức năng:
- CRUD Theme.
- Tên Theme.
- Mã Theme.
- Mô tả.
- Cấu hình giao diện.
- Preview.
- Trạng thái Active / Inactive.
- Chỉ có một Theme mặc định được kích hoạt tại một thời điểm.

Cấu hình Theme nên hỗ trợ JSON để dễ mở rộng.

### 5.12. Banner Management

Chức năng:
- CRUD Banner.
- Tiêu đề.
- Hình ảnh Desktop.
- Hình ảnh Mobile.
- Link điều hướng.
- Vị trí hiển thị.
- Thứ tự.
- Thời gian bắt đầu.
- Thời gian kết thúc.
- Trạng thái Active / Inactive.

### 5.13. Upload Management

Chức năng:
- Upload hình ảnh.
- Validate file type.
- Validate file size.
- Trả URL hình ảnh.
- Tách logic lưu trữ file khỏi Business Module.
- Thiết kế có khả năng tích hợp S3 hoặc Cloudinary sau này.

## 6. DATABASE DESIGN

Sử dụng PostgreSQL và Prisma ORM.

Thiết kế các bảng:

### Authentication & Authorization
- users
- roles
- permissions
- role_permissions
- refresh_tokens (nếu triển khai refresh token dạng lưu trữ)

### Product
- categories
- products
- product_images
- product_variants

### Content
- posts
- post_categories

### Customer
- customers
- customer_addresses

### Order
- orders
- order_items
- order_status_histories

### Website
- themes
- banners

### System
- settings
- audit_logs (nếu triển khai trong giai đoạn đầu)

Yêu cầu Database:
- Primary Key.
- Foreign Key.
- Unique Constraint.
- Index cho các trường thường xuyên tìm kiếm.
- created_at.
- updated_at.
- deleted_at khi sử dụng Soft Delete.
- Enum cho các trạng thái phù hợp.
- Quy định OnDelete rõ ràng.
- Không lạm dụng JSON cho các dữ liệu quan hệ.
- Lưu tiền bằng Decimal, không dùng Float.
- Có Migration và Seed.
- Có Database Transaction cho nghiệp vụ cần tính nhất quán.

Thiết kế đầy đủ quan hệ và cardinality trước khi tạo Prisma Schema.

## 7. STANDARD API RESPONSE

Tất cả API bắt buộc sử dụng chung một format:

{
  "code": 200,
  "message": "Lấy dữ liệu thành công",
  "data": {}
}

Không được trả response khác cấu trúc này.

### Success Response

{
  "code": 200,
  "message": "Thành công",
  "data": {}
}

### Create Response

{
  "code": 201,
  "message": "Tạo mới thành công",
  "data": {}
}

### Validation Error

{
  "code": 400,
  "message": "Dữ liệu không hợp lệ",
  "data": {
    "errors": [
      {
        "field": "name",
        "message": "Tên không được để trống"
      }
    ]
  }
}

### Unauthorized

{
  "code": 401,
  "message": "Bạn chưa đăng nhập",
  "data": null
}

### Forbidden

{
  "code": 403,
  "message": "Bạn không có quyền thực hiện thao tác này",
  "data": null
}

### Not Found

{
  "code": 404,
  "message": "Không tìm thấy dữ liệu",
  "data": null
}

### Internal Server Error

{
  "code": 500,
  "message": "Đã xảy ra lỗi hệ thống",
  "data": null
}

Quy định:

- code là HTTP status code.
- message là thông báo trả về cho Frontend.
- data chứa dữ liệu hoặc null.
- HTTP status thực tế phải trùng với code.
- Tất cả lỗi phải đi qua Global Exception Filter.
- Tất cả response thành công phải đi qua Global Response Interceptor.
- Không trả stack trace ra Client.
- Không để Service tự đóng gói response HTTP.
- Có thể bổ sung errorCode nghiệp vụ trong data khi cần.

Phân trang:

{
  "code": 200,
  "message": "Thành công",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}

Tạo ApiResponse<T> interface và các DTO dùng chung.

## 8. SWAGGER DOCUMENTATION

Swagger là yêu cầu bắt buộc.

Cấu hình:
- Swagger title: Cake Shop API.
- Version: 1.0.
- API prefix: /api/v1.
- Swagger URL: /api/docs.
- Bearer Authentication.
- Mô tả API rõ ràng.
- Request DTO.
- Response DTO.
- HTTP Status Code.
- Validation Error.
- Authorization Error.
- Pagination Schema.

Tạo các decorator dùng chung:

- ApiStandardResponse()
- ApiStandardArrayResponse()
- ApiStandardErrorResponse()
- ApiStandardPaginatedResponse()

Mọi API phải được mô tả response theo đúng Standard API Response.

Không để Swagger hiển thị response DTO thuần trong khi API thực tế trả response bọc ngoài.

## 9. GLOBAL VALIDATION & ERROR HANDLING

Đăng ký Global ValidationPipe:

- whitelist: true.
- transform: true.
- forbidNonWhitelisted: true.

Tạo:
- Global Response Interceptor.
- Global Exception Filter.
- Validation Exception Handler.
- Prisma Exception Handler.

Chuẩn hóa các lỗi Prisma phổ biến:
- Record Not Found.
- Unique Constraint.
- Foreign Key Constraint.
- Database Connection Error.

Không để lỗi database nội bộ xuất hiện trong message trả về Client.

## 10. API CONVENTION

Sử dụng RESTful API.

Prefix:

/api/v1

Ví dụ:

POST /api/v1/auth/login

GET /api/v1/products

GET /api/v1/products/:id

POST /api/v1/products

PATCH /api/v1/products/:id

DELETE /api/v1/products/:id

GET /api/v1/orders

POST /api/v1/orders

PATCH /api/v1/orders/:id/status

GET /api/v1/reports/revenue

GET /api/v1/roles

POST /api/v1/roles

PATCH /api/v1/roles/:id/permissions

Quy định:
- GET để lấy dữ liệu.
- POST để tạo mới.
- PATCH để cập nhật một phần.
- PUT cho cập nhật toàn bộ khi phù hợp.
- DELETE để xóa.
- Sử dụng pagination cho danh sách.
- Hỗ trợ filter và search.
- Sử dụng DTO cho tất cả Request.
- Không trả trực tiếp Prisma Model ra API nếu có nguy cơ lộ dữ liệu nội bộ.

## 11. SECURITY

Triển khai:
- JWT Authentication.
- Password Hashing.
- RBAC.
- CORS.
- Helmet.
- Validation.
- Rate Limiting cho API nhạy cảm.
- Bảo vệ các API quản trị.
- Không lưu mật khẩu dạng plain text.
- Không commit file .env.
- Không expose thông tin nhạy cảm.
- Kiểm tra quyền sở hữu dữ liệu khi cần.
- Audit log cho thao tác quản trị quan trọng.

Refresh Token cần có cơ chế rotation, revoke và lưu trữ an toàn.

## 12. DOCKER & ENVIRONMENT

Tạo:
- Dockerfile.
- docker-compose.yml.
- .env.example.

Docker Compose tối thiểu gồm:
- Backend API.
- PostgreSQL.

Có thể bổ sung Redis khi triển khai caching hoặc background jobs.

Environment Variables:

DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
PORT=3000
NODE_ENV=development

Không hardcode secret.

## 13. TESTING

Sử dụng Jest.

Bắt buộc có test cho:

### Auth
- Login thành công.
- Login sai mật khẩu.
- Tài khoản bị khóa.
- Token không hợp lệ.

### RBAC
- User có Permission.
- User không có Permission.
- Role không có Permission.
- Thay đổi Permission của Role.
- Không cho phép User tự nâng quyền.

### Products
- Tạo sản phẩm.
- Validate dữ liệu.
- Lấy danh sách.
- Cập nhật.
- Xóa.
- Kiểm tra Permission.

### Orders
- Tạo đơn hàng.
- Tính tổng tiền.
- Snapshot giá sản phẩm.
- Chuyển trạng thái.
- Hủy đơn hàng.
- Kiểm tra dữ liệu không hợp lệ.

### Standard Response
- Response thành công đúng format.
- Response lỗi đúng format.
- Validation Error đúng format.
- HTTP Status trùng với code.
- Swagger schema khớp API thực tế.

## 14. CODING CONVENTION

- Sử dụng TypeScript strict mode.
- Ưu tiên async/await.
- Không sử dụng any tùy tiện.
- Đặt tên class theo PascalCase.
- Đặt tên biến và function theo camelCase.
- Đặt tên file theo kebab-case.
- Không viết Business Logic trong Controller.
- Không viết SQL trực tiếp nếu Prisma đáp ứng được.
- Không lặp lại logic giữa các module.
- Không tạo abstraction phức tạp không cần thiết.
- Sử dụng DTO riêng cho Create, Update, Query.
- Tách cấu hình Environment.
- Có logging và xử lý lỗi nhất quán.

## 15. IMPLEMENTATION ROADMAP

Không xây dựng toàn bộ hệ thống một cách thiếu kiểm soát.

Thực hiện tuần tự:

### Phase 1: Project Foundation
- Khởi tạo NestJS.
- Cài dependencies.
- Cấu hình TypeScript.
- Cấu hình Environment.
- Docker.
- PostgreSQL.
- Prisma.
- Global Validation.
- Standard Response.
- Global Exception Filter.
- Swagger.
- Logging.

### Phase 2: Authentication & Authorization
- Users.
- Roles.
- Permissions.
- Role Permissions.
- JWT.
- Refresh Token.
- Guards.
- Decorators.
- Seed dữ liệu mặc định.

### Phase 3: Product Management
- Categories.
- Products.
- Product Images.
- Product Variants.

### Phase 4: Content Management
- Posts.
- Themes.
- Banners.

### Phase 5: Customer & Order Management
- Customers.
- Addresses.
- Orders.
- Order Items.
- Order Status History.

### Phase 6: Reports & Finalization
- Reports.
- Uploads.
- Audit Logs.
- Unit Test.
- Integration Test.
- Swagger Review.
- Security Review.
- README.

## 16. WORKING RULES FOR CURSOR

Rất quan trọng: Hãy làm việc theo các nguyên tắc sau.

1. Trước khi code, hãy phân tích yêu cầu và đề xuất kiến trúc.
2. Kiểm tra cấu trúc repository hiện tại trước khi tạo hoặc chỉnh sửa file.
3. Nếu repository trống, khởi tạo project mới.
4. Nếu đã có source code, không ghi đè tùy tiện.
5. Xây dựng theo từng Phase.
6. Sau mỗi Phase, phải kiểm tra TypeScript compilation.
7. Chạy Prisma validation và migration khi phù hợp.
8. Chạy test sau khi hoàn thành module.
9. Không để TODO thay thế cho nghiệp vụ đã được yêu cầu.
10. Không tạo file giả hoặc khai báo API chưa có implementation.
11. Không tự ý bỏ qua yêu cầu đã nêu.
12. Nếu có điểm chưa rõ, hãy nêu giả định và đề xuất phương án trước khi triển khai.
13. Cập nhật README sau mỗi giai đoạn.
14. Không triển khai module tiếp theo khi module hiện tại còn lỗi nghiêm trọng.
15. Giữ nguyên Standard API Response và coding convention trên toàn hệ thống.

Sau mỗi Phase, hãy báo cáo:

- Những gì đã triển khai.
- Danh sách file đã tạo hoặc thay đổi.
- Database schema đã xây dựng.
- API đã triển khai.
- Kết quả kiểm tra compilation.
- Kết quả Unit Test.
- Các vấn đề còn tồn tại.
- Công việc tiếp theo.

## 17. FIRST TASK

Bắt đầu với Phase 1: Project Foundation.

Trước tiên:
1. Phân tích cấu trúc project.
2. Đề xuất kiến trúc chi tiết.
3. Đề xuất package cần cài đặt.
4. Xây dựng cấu trúc thư mục.
5. Khởi tạo NestJS.
6. Cấu hình PostgreSQL và Prisma.
7. Cấu hình Global Response Interceptor.
8. Cấu hình Global Exception Filter.
9. Cấu hình Swagger.
10. Cấu hình Docker.
11. Viết README hướng dẫn chạy project.

Sau đó kiểm tra toàn bộ project và báo cáo kết quả.

Không chuyển sang Phase 2 cho đến khi Phase 1 hoàn thành và được xác nhận.

END OF MASTER PROMPT.