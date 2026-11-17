# Giao diện

- Thứ tự: 19
- Trạng thái: Chưa làm
- Module: themes
- Database: `database/themes.md`

## Phạm vi

CRUD theme. Kích hoạt theme mới thì tắt theme đang active, trong một transaction.

## API

`GET|POST /api/v1/themes`, `GET|PATCH|DELETE /api/v1/themes/:id`

Quyền `themes.view` và `themes.manage`.

## Ngoài phạm vi

Banner. Upload file.
