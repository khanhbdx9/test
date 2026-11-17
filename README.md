# Cake Shop Backend

API quản lý cửa hàng bánh sinh nhật. Phase 2 gồm xác thực JWT, refresh token và phân quyền RBAC.

## Yêu cầu

- Node.js 22 trở lên
- Docker và Docker Compose khi chạy bằng container

## Biến môi trường

Local/dev dùng file `.env`. Production không dùng dotenv — inject biến môi trường qua Docker/platform.

```bash
cp .env.example .env
```

| Biến | Mục đích |
|---|---|
| `DATABASE_URL` | PostgreSQL app (dev/prod). Deploy chỉ dùng biến này |
| `DATABASE_URL_TEST` | PostgreSQL test (`cake_shop_test`). Chỉ local/CI, không set trên prod |
| `JWT_SECRET` | Secret access token |
| `JWT_EXPIRES_IN` | Thời hạn access token, ví dụ `15m` |
| `JWT_REFRESH_SECRET` | Secret băm refresh token |
| `JWT_REFRESH_EXPIRES_IN` | Thời hạn refresh token, ví dụ `7d` |
| `SEED_SUPER_ADMIN_EMAIL` | Email tài khoản SUPER_ADMIN khi seed |
| `SEED_SUPER_ADMIN_PASSWORD` | Mật khẩu tài khoản SUPER_ADMIN khi seed |
| `SEED_SUPER_ADMIN_NAME` | Tên tài khoản SUPER_ADMIN |
| `PORT` | Cổng HTTP, mặc định `3000` |
| `NODE_ENV` | `development`, `test` hoặc `production` |

## Chạy local

```bash
npm install
npm run start:dev
```

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`
- Health: `GET /api/v1/health`
- Đăng nhập: `POST /api/v1/auth/login`
- Làm mới token: `POST /api/v1/auth/refresh`
- Đăng xuất: `POST /api/v1/auth/logout`
- Tài khoản hiện tại: `GET /api/v1/auth/me`

`npm install` chạy `prisma generate`. Prisma Client được sinh vào `src/generated` và không commit.

## Docker

```bash
docker compose up --build
```

Compose khởi động API và PostgreSQL 16. API trong container dùng host `postgres`.

## Prisma

App / production (chỉ `DATABASE_URL`):

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate          # local: tạo migration
npm run prisma:migrate:deploy  # deploy/prod: apply migration
npm run prisma:seed
```

Test local (chỉ `DATABASE_URL_TEST`, không chạy trên prod):

```bash
npm run prisma:test:prepare
```

Docker prod chạy `prisma migrate deploy` trong `docker/entrypoint.sh` trước khi start API. Database test không được tạo trên production.

Seed tạo permission, 5 role hệ thống (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `STAFF`, `CONTENT_EDITOR`) và tài khoản SUPER_ADMIN. Role hệ thống không sửa hoặc xóa được. Refresh token được lưu dạng hash, xoay vòng khi làm mới và thu hồi khi đăng xuất.

API quản trị: `/api/v1/users`, `/api/v1/roles`, `/api/v1/permissions`.

## Kiểm tra

```bash
npx tsc --noEmit
npm test
npm run test:e2e
npm run build
```

## Response chuẩn

Mọi API trả về:

```json
{
  "code": 200,
  "message": "Thành công",
  "data": {}
}
```

`code` trùng HTTP status. Lỗi đi qua exception filter. Response thành công đi qua interceptor.
