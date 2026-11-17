# themes

- Trạng thái: Chưa làm
- Module: themes

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| name | string | |
| code | string | unique |
| description | text | null |
| config | jsonb | |
| preview_url | string | null |
| is_active | boolean | default false, chỉ một bản ghi true |
| created_at | timestamptz | |
| updated_at | timestamptz | |
