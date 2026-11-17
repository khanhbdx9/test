# Tạo đơn hàng

- Thứ tự: 23
- Trạng thái: Chưa làm
- Module: orders
- Database: `database/orders.md`, `database/order-items.md`
- Phụ thuộc: product biến thể, customers

## Phạm vi

Tạo đơn trong một transaction. Backend tính tổng từ giá biến thể trong database. Mỗi dòng lưu snapshot. Chống tạo trùng bằng idempotency key.

## API

- `POST /api/v1/orders` quyền `orders.create`
- `GET /api/v1/orders` và `GET /api/v1/orders/:id` quyền `orders.view`

## Ngoài phạm vi

Đổi trạng thái. Báo cáo.
