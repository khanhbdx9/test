# Phiên đăng nhập

- Thứ tự: 03
- Trạng thái: Xong
- Module: auth
- Database: `database/refresh-tokens.md`

## Đã giao

- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

Refresh token lưu hash, xoay vòng. Dùng lại token cũ thì thu hồi các token đang hoạt động.
