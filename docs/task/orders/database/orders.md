# orders

- Trạng thái: Xong
- Module: orders

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| email | string | null, index |
| phone | string | bắt buộc, index |
| shipping_address | string | null — bắt buộc khi `DELIVERY` |
| full_name | string | null |
| note | text | null |
| payment_method | PaymentMethod | `AT_STORE`, `BANK_TRANSFER`, index |
| payment_image_url | string | null — ảnh KH chuyển khoản |
| fulfillment_method | FulfillmentMethod | `PICKUP`, `DELIVERY`, index |
| status | OrderStatus | mặc định `PENDING_CONFIRMATION`, index |
| delivery_date | date | bắt buộc khi `BANK_TRANSFER`, index |
| delivery_time | string | null — khung/giờ giao, index |
| total_amount | decimal(12,2) | tổng `(unitPrice * quantity)` các dòng `order_items` |
| created_at | timestamptz | hệ thống |
| updated_at | timestamptz | hệ thống |

Enum `PaymentMethod`:

- `AT_STORE` — tại cửa hàng
- `BANK_TRANSFER` — chuyển khoản

Enum `FulfillmentMethod`:

- `PICKUP` — nhận tại cửa hàng (`shipping_address` = null)
- `DELIVERY` — giao tận nơi (`shipping_address` bắt buộc)

Enum `OrderStatus`:

- `PENDING_CONFIRMATION` — chờ xác nhận
- `REJECTED` — từ chối
- `CONFIRMED` — xác nhận
- `NEED_CALLBACK` — cần liên hệ lại
- `COMPLETED` — hoàn thành
