# Gán role

- Thứ tự: 09
- Trạng thái: Xong
- Module: users
- Database: `database/users.md`

## Đã giao

`PATCH /api/v1/users/:id/role` quyền `users.update`

Chỉ gán role có tập quyền nằm trong quyền của người thực hiện. Chỉ SUPER_ADMIN được gán role SUPER_ADMIN.
