# orders

- Trạng thái: Xong
- Module: orders
- Phase: đơn giản (chưa có order_items riêng, customers, lịch sử trạng thái)

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| email | string | null, index |
| phone | string | bắt buộc, index |
| shipping_address | string | bắt buộc |
| full_name | string | null |
| note | text | null |
| payment_method | PaymentMethod | `AT_STORE`, `BANK_TRANSFER`, index |
| payment_image_url | string | null — ảnh KH chuyển khoản |
| status | OrderStatus | mặc định `PENDING_CONFIRMATION`, index |
| delivery_date | date | bắt buộc khi `BANK_TRANSFER`, index |
| delivery_time | string | null — khung/giờ giao, index |
| product_ids | uuid[] | list id sản phẩm FE gửi; backend lấy giá từ DB |
| total_amount | decimal(12,2) | backend tính từ giá hiệu lực (salePrice ?? price) |
| created_at | timestamptz | hệ thống |
| updated_at | timestamptz | hệ thống |

Enum `PaymentMethod`:

- `AT_STORE` — tại cửa hàng
- `BANK_TRANSFER` — chuyển khoản

Enum `OrderStatus`:

- `PENDING_CONFIRMATION` — chờ xác nhận
- `REJECTED` — từ chối
- `CONFIRMED` — xác nhận
- `NEED_CALLBACK` — cần liên hệ lại
- `COMPLETED` — hoàn thành
