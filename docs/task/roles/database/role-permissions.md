# role_permissions

- Trạng thái: Xong
- Module: roles

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| role_id | uuid | PK, FK roles, onDelete Cascade |
| permission_id | uuid | PK, FK permissions, onDelete Restrict, index |
