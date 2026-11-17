# Đăng nhập

- Thứ tự: 02
- Trạng thái: Xong
- Module: auth

## Đã giao

`POST /api/v1/auth/login`

Email và mật khẩu. Mật khẩu bcrypt. Không trả `passwordHash`. Tài khoản khóa trả 403. Sai mật khẩu trả 401. Trả access token JWT.
