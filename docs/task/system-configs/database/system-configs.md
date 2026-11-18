# system_configs

- Trạng thái: Xong
- Module: system-configs

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| key | string | unique, index |
| value | text | |
| description | text | null |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Key hệ thống:

- `EMAIL_NOTIFICATION` — email nhận thông báo đơn hàng mới. Có thể nhiều địa chỉ, phân tách bằng `;` (ví dụ `a@shop.local; b@shop.local`).
