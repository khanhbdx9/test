# Lịch sử mua hàng

- Thứ tự: 25
- Trạng thái: Chưa làm
- Module: customers
- Phụ thuộc: orders

## Phạm vi

Đọc đơn của một khách từ bảng `orders`. Không tạo bảng mới.

## API

`GET /api/v1/customers/:id/orders` quyền `orders.view`

Phân trang. Trả mã đơn, trạng thái, tổng tiền, thời điểm tạo.
