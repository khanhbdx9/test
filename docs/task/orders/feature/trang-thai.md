# Cập nhật trạng thái đơn (phase đơn giản)

- Thứ tự: 24
- Trạng thái: Xong
- Module: orders
- Database: `database/orders.md`
- Phụ thuộc: `feature/tao-don.md`

## Phạm vi

Chỉ cập nhật trường `status`. Không ghi `order_status_histories` trong phase này.

## API

- `PUT /api/v1/orders/:id/update` quyền `orders.update` — body `{ status }` (chỉ cập nhật trạng thái)

## Ngoài phạm vi

Lịch sử trạng thái, hủy đơn riêng, báo cáo.
