# Trạng thái đơn hàng

- Thứ tự: 24
- Trạng thái: Chưa làm
- Module: orders
- Database: `database/order-status-histories.md`
- Phụ thuộc: `feature/tao-don.md`

## Phạm vi

Chỉ đi chiều tiến. `CANCELLED` từ trạng thái chưa `COMPLETED`. Mỗi lần đổi ghi lịch sử. Hủy đơn dùng `orders.cancel`.

## API

- `PATCH /api/v1/orders/:id` quyền `orders.update`
- `PATCH /api/v1/orders/:id/status`
- `GET /api/v1/orders/:id/status-histories` quyền `orders.view`

## Ngoài phạm vi

Báo cáo doanh thu.
