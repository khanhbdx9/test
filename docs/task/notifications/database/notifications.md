# notifications

- Trạng thái: Xong
- Module: notifications

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK users, onDelete Cascade, index |
| type | NotificationType | ORDER_CREATED, index |
| title | string | |
| message | text | |
| link | string | null |
| metadata | json | null |
| is_read | boolean | default false, index |
| read_at | timestamptz | null |
| created_at | timestamptz | index |
| updated_at | timestamptz | |
