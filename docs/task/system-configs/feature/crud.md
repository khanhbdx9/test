# CRUD cấu hình hệ thống

- Thứ tự: 29
- Trạng thái: Xong
- Module: system-configs
- Database: `database/system-configs.md`

## Phạm vi

Quản trị key/value cấu hình hệ thống. `key` unique.

Seed mặc định: `EMAIL_NOTIFICATION` — một hoặc nhiều email nhận thông báo đơn mới, phân tách bằng `;`. Dùng bởi `MailService` khi tạo đơn public.

## API

- `GET /api/v1/system-configs` quyền `system-configs.view`
- `GET /api/v1/system-configs/:id` quyền `system-configs.view`
- `POST /api/v1/system-configs` quyền `system-configs.create`
- `PATCH /api/v1/system-configs/:id` quyền `system-configs.update`
- `DELETE /api/v1/system-configs/:id` quyền `system-configs.delete`

## Ngoài phạm vi

UI public đọc config.
