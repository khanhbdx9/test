# customer_addresses

- Trạng thái: Chưa làm
- Module: customers

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| customer_id | uuid | FK customers, onDelete Cascade, index |
| recipient_name | string | |
| phone | string | |
| address | string | |
| is_default | boolean | default false, một địa chỉ mặc định mỗi khách |
| created_at | timestamptz | |
| updated_at | timestamptz | |
