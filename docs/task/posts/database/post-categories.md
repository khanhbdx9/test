# post_categories

- Trạng thái: Chưa làm
- Module: posts

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| name | string | |
| slug | string | unique |
| description | text | null |
| sort_order | int | default 0 |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Không xóa khi còn bài viết. Xóa mềm đổi `slug` thành `deleted.{id}`.
