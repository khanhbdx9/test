# users

- Trạng thái: Xong
- Module: users

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| email | string | unique |
| password_hash | string | |
| full_name | string | |
| status | UserStatus | ACTIVE, LOCKED, default ACTIVE, index |
| role_id | uuid | FK roles, onDelete Restrict, index |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Enum `UserStatus`: `ACTIVE`, `LOCKED`.
