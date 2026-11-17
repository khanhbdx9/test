# audit_logs

- Trạng thái: Chưa làm
- Module: audit-logs

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| actor_id | uuid | FK users, onDelete Restrict, index |
| action | string | |
| module | string | index |
| target_id | uuid | index |
| created_at | timestamptz | index |

Không lưu mật khẩu.
