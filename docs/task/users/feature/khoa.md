# Khóa tài khoản

- Thứ tự: 08
- Trạng thái: Xong
- Module: users
- Database: `database/users.md`

## Đã giao

- `PATCH /api/v1/users/:id/lock`
- `PATCH /api/v1/users/:id/unlock`

Quyền `users.update`. Khóa thì thu hồi refresh token. Không khóa chính mình và SUPER_ADMIN cuối cùng.
