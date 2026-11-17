# customers

- Trạng thái: Chưa làm
- Module: customers

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| full_name | string | |
| email | string | null |
| phone | string | index |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Email đang dùng thì unique. Xóa mềm đổi email thành `deleted.{id}@customers.local`.
