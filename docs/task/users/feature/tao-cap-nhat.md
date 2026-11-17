# Tạo và cập nhật tài khoản

- Thứ tự: 06
- Trạng thái: Xong
- Module: users
- Database: `database/users.md`

## Đã giao

- `POST /api/v1/users` quyền `users.create`
- `PATCH /api/v1/users/:id` quyền `users.update`

Hash mật khẩu. Email đang dùng là duy nhất. Không gán role cao hơn quyền hiện tại.
