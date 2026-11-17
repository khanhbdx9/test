# orders

- Trạng thái: Chưa làm
- Module: orders

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | string | unique |
| customer_id | uuid | FK customers, onDelete Restrict, index |
| idempotency_key | string | unique |
| recipient_name | string | |
| recipient_phone | string | |
| address | string | |
| receive_at | timestamptz | null |
| note | text | null |
| total | decimal(12,2) | backend tính |
| payment_method | string | |
| payment_status | PaymentStatus | UNPAID, PAID, index |
| status | OrderStatus | index |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Enum `OrderStatus`: `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `SHIPPING`, `COMPLETED`, `CANCELLED`.
