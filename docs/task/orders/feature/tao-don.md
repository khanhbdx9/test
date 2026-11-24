# Tạo đơn hàng

- Thứ tự: 23
- Trạng thái: Xong
- Module: orders
- Database: `database/orders.md`, `database/order-items.md`
- Phụ thuộc: products (variants), uploads (ảnh chuyển khoản, optional)

## Phạm vi

Khách tạo đơn công khai kèm `items[]` (`productId`, `variantId`, `quantity`). Backend:

- Validate biến thể ACTIVE thuộc sản phẩm PUBLISHED
- Tính `unitPrice` = `salePrice ?? price` của biến thể
- `totalAmount` = tổng `unitPrice * quantity`
- Lưu snapshot dòng hàng vào `order_items`
- `fulfillmentMethod`: `PICKUP` (không cần địa chỉ) hoặc `DELIVERY` (bắt buộc `shippingAddress`)
- Trạng thái mặc định `PENDING_CONFIRMATION`
- Khi `paymentMethod = BANK_TRANSFER` bắt buộc `deliveryDate`

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

Idempotency, khách hàng, lịch sử trạng thái chi tiết, báo cáo.
