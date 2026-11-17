# permissions

- Trạng thái: Xong
- Module: permissions

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | string | unique, dạng `module.action` |
| module | string | index |
| action | string | unique cùng `module` |
| description | string | null |
| created_at | timestamptz | |
| updated_at | timestamptz | |
