# refresh_tokens

- Trạng thái: Xong
- Module: auth

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK users, onDelete Cascade |
| token_hash | string | unique |
| expires_at | timestamptz | index |
| revoked_at | timestamptz | null |
| replaced_by_id | uuid | unique, self FK, onDelete SetNull |
| created_at | timestamptz | |

Index: `user_id`, `expires_at`.
