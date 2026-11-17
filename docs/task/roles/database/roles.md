# roles

- Trạng thái: Xong
- Module: roles

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | string | unique |
| name | string | |
| description | string | null |
| is_system | boolean | default false, index |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Role hệ thống: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `STAFF`, `CONTENT_EDITOR`.
