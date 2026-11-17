# Xóa mềm người dùng

- Thứ tự: 07
- Trạng thái: Xong
- Module: users
- Database: `database/users.md`

## Đã giao

`DELETE /api/v1/users/:id` quyền `users.delete`

Ghi `deleted_at`, đổi email thành `deleted.{id}@users.local`, thu hồi refresh token. Không xóa chính mình. Không xóa SUPER_ADMIN cuối cùng.
