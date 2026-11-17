# categories

- Trạng thái: Xong
- Module: categories

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| parent_id | uuid | null, self FK, onDelete Restrict, index |
| name | string | |
| slug | string | unique |
| description | text | null |
| image_url | string | null, không bắt buộc |
| status | CategoryStatus | VISIBLE, HIDDEN, index |
| sort_order | int | default 0 |
| seo_title | string | null |
| seo_description | string | null |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Xóa mềm đổi `slug` thành `deleted.{id}` để dùng lại slug.
