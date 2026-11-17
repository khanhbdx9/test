# Gán permission

- Thứ tự: 11
- Trạng thái: Xong
- Module: roles
- Database: `database/role-permissions.md`

## Đã giao

- `GET /api/v1/roles/:id/permissions`
- `PATCH /api/v1/roles/:id/permissions`

Thay toàn bộ permission của role trong một transaction. Không gán quyền mà người thực hiện không có. Không sửa permission của role hệ thống.
