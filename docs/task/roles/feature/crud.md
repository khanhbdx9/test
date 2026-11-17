# CRUD role

- Thứ tự: 10
- Trạng thái: Xong
- Module: roles
- Database: `database/roles.md`

## Đã giao

- `GET|POST /api/v1/roles`
- `GET|PATCH|DELETE /api/v1/roles/:id`

Quyền `roles.view|create|update|delete`. Role `is_system` không sửa, không xóa. Role còn user thì không xóa.
