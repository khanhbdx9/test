# order_status_histories

- Trạng thái: Chưa làm
- Module: orders

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK orders, onDelete Cascade, index |
| from_status | OrderStatus | null khi tạo đơn |
| to_status | OrderStatus | |
| actor_id | uuid | FK users, onDelete Restrict |
| note | text | null |
| created_at | timestamptz | |
