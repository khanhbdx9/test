# Thông báo email đơn mới

- Thứ tự: 23.1
- Trạng thái: Xong
- Module: orders / mail
- Database: `../system-configs/database/system-configs.md`
- Phụ thuộc: `feature/tao-don.md`, system-configs

## Phạm vi

Sau khi `POST /public/orders/create` thành công, gửi email HTML (table + inline CSS) cho chủ cửa hàng.

- **Địa chỉ nhận** từ `system_configs` key `EMAIL_NOTIFICATION`
- Nhiều email: phân tách bằng `;` hoặc `,`
- Mail + notification chạy nền (`setImmediate`) — không làm 502 response
- `MAIL_ENABLED=false` để tắt gửi mail

## Transport

### `MAIL_TRANSPORT=smtp` (local)

Dùng Gmail App Password:

```env
MAIL_TRANSPORT=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ban@gmail.com
SMTP_PASS=app-password
SMTP_FROM="Minh Sam <ban@gmail.com>"
```

Nhiều host cloud (Render…) **block SMTP** → `Connection timeout`.

### `MAIL_TRANSPORT=gmail-api` (server / production)

Gửi qua Gmail API HTTPS (port 443) — vẫn là Gmail thật:

```env
MAIL_TRANSPORT=gmail-api
MAIL_ENABLED=true
SMTP_USER=ban@gmail.com
SMTP_FROM="Minh Sam <ban@gmail.com>"
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
```

Lấy refresh token:

1. Google Cloud → enable **Gmail API** → OAuth Client (Desktop hoặc Web)
2. Redirect URI: `http://localhost:53682/oauth2callback`
3. **OAuth consent screen** → Publishing status = Testing → **Test users** thêm đúng Gmail gửi (`SMTP_USER`)
4. Chạy `scripts/gmail-oauth-setup.ts` → đăng nhập đúng tài khoản test user → Allow
5. Nếu `403: access_denied` → thiếu Test user (bước 3)
6. Nếu `unauthorized_client` → refresh token không khớp client; chạy lại bước 4

## Ngoài phạm vi

Hàng đợi mail, attachment PDF.
