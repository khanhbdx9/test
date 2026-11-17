# posts

- Trạng thái: Chưa làm
- Module: posts

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| category_id | uuid | FK post_categories, onDelete Restrict, index |
| author_id | uuid | FK users, onDelete Restrict, index |
| title | string | |
| slug | string | unique |
| thumbnail_url | string | null |
| content | text | |
| excerpt | text | null |
| status | PostStatus | DRAFT, PUBLISHED, index |
| published_at | timestamptz | null |
| seo_title | string | null |
| seo_description | string | null |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Xóa mềm đổi `slug` thành `deleted.{id}`.
