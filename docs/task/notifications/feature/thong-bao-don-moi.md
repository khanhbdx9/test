# Thông báo đơn hàng mới

- Thứ tự: 23.2
- Trạng thái: Xong
- Module: notifications
- Database: `database/notifications.md`
- Phụ thuộc: `orders` tạo đơn public

## Phạm vi

Khi `POST /public/orders/create` thành công, tạo notification type `ORDER_CREATED` cho mọi user `ACTIVE` (chưa xóa) có quyền `orders.view`.

## API

| Method | Path | Mô tả |
|---|---|---|
| `GET` | `/api/v1/notifications` | Danh sách của tôi (`isRead`, phân trang) |
| `GET` | `/api/v1/notifications/unread-count` | Số chưa đọc |
| `GET` | `/api/v1/notifications/:id` | Chi tiết |
| `PATCH` | `/api/v1/notifications/:id/read` | Đánh dấu đã đọc |
| `PATCH` | `/api/v1/notifications/:id/unread` | Đánh dấu chưa đọc |
| `POST` | `/api/v1/notifications/bulk-read` | Body `{ ids }` hoặc `{ all: true }` |

Quyền: `notifications.view`.
