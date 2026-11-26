# Cake Shop Backend

API quản lý cửa hàng bánh sinh nhật. Phase 2 gồm xác thực JWT, refresh token và phân quyền RBAC.

## Yêu cầu

- Node.js 22 trở lên
- Docker và Docker Compose khi chạy bằng container

## Biến môi trường

Chỉ dùng **một** file `.env` (git ignore). Production không đọc file — inject biến qua Docker/platform.

| Biến | Mục đích |
|---|---|
| `DATABASE_URL` | PostgreSQL (Render). Dev/test/prod cùng biến này |
| `JWT_SECRET` | Secret access token |
| `JWT_EXPIRES_IN` | Thời hạn access token, ví dụ `15m` |
| `JWT_REFRESH_SECRET` | Secret băm refresh token |
| `JWT_REFRESH_EXPIRES_IN` | Thời hạn refresh token, ví dụ `7d` |
| `SEED_SUPER_ADMIN_EMAIL` | Email tài khoản SUPER_ADMIN khi seed |
| `SEED_SUPER_ADMIN_PASSWORD` | Mật khẩu tài khoản SUPER_ADMIN khi seed |
| `SEED_SUPER_ADMIN_NAME` | Tên tài khoản SUPER_ADMIN |
| `PORT` | Cổng HTTP, mặc định `3000` |
| `NODE_ENV` | `development`, `test` hoặc `production` |
| `SMTP_HOST` | SMTP host (**bắt buộc nếu muốn gửi mail** — thiếu thì bỏ qua gửi) |
| `SMTP_PORT` | SMTP port, ví dụ `587` |
| `SMTP_USER` | SMTP user |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Địa chỉ From (mặc định dùng `SMTP_USER`) |

Địa chỉ **nhận** thông báo đơn mới lấy từ `system_configs.EMAIL_NOTIFICATION` (CMS), không lấy từ env.

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

Compose chỉ chạy API; Postgres lấy từ `DATABASE_URL` trong `.env` (Render). Không còn service Postgres local.

## Prisma

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate          # tạo migration
npm run prisma:migrate:deploy  # apply migration
npm run prisma:seed            # RBAC + SUPER_ADMIN
npm run prisma:seed:mock       # mock category + product (riêng)
```

Chỉ một database (`DATABASE_URL`). Không tạo DB test riêng. Docker chạy `prisma migrate deploy` trong `docker/entrypoint.sh` trước khi start API.

### Backup / restore data

```bash
npm run db:export   # dump từ DATABASE_URL → backups/*.sql
TARGET_DATABASE_URL='...' npm run db:import -- backups/data-....sql
```

`prisma:seed` tạo permission, 5 role hệ thống và SUPER_ADMIN. `prisma:seed:mock` upsert danh mục/sản phẩm mẫu (không chạy trong seed mặc định). Role hệ thống không sửa hoặc xóa được.

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
