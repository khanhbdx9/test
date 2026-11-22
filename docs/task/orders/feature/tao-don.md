# Tạo đơn hàng (phase đơn giản)

- Thứ tự: 23
- Trạng thái: Xong
- Module: orders
- Database: `database/orders.md`
- Phụ thuộc: products, uploads (ảnh chuyển khoản, optional)

## Phạm vi

Khách tạo đơn công khai kèm `productIds`. Backend load sản phẩm còn hiệu lực từ DB, tính `totalAmount` = tổng `(salePrice ?? price)`. Trạng thái mặc định `PENDING_CONFIRMATION`. Khi `payment_method = BANK_TRANSFER` bắt buộc `delivery_date`.

Sau tạo đơn thành công (không chặn response nếu lỗi phụ):

- Gửi email theo `EMAIL_NOTIFICATION` — xem `feature/thong-bao-email.md`
- Tạo in-app notification `ORDER_CREATED` — xem `docs/task/notifications`

## API

- `POST /api/v1/public/orders/create` — public
- `GET /api/v1/orders` quyền `orders.view` — **bắt buộc** `page`, `limit`, `createdFrom`, `createdTo` (lọc `created_at`); tùy chọn `deliveryDate`, `deliveryTime`, `search`, `status`; luôn sort `createdAt` mới nhất trước
- `GET /api/v1/orders/history` quyền `orders.view` — chỉ `REJECTED` | `COMPLETED`, cùng query bắt buộc như trên (xem `feature/lich-su.md`)
- `GET /api/v1/orders/:id` quyền `orders.view`
- `PUT /api/v1/orders/:id/update` quyền `orders.update` — chỉ `status`

## Ngoài phạm vi

Order items snapshot bảng riêng, idempotency, khách hàng, lịch sử trạng thái chi tiết, báo cáo.
