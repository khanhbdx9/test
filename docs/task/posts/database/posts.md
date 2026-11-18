# posts

- Trạng thái: Xong
- Module: posts

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| author_id | uuid | FK users, onDelete Restrict, index |
| title | string | |
| slug | string | unique |
| thumbnail_url | string | null |
| content | text | HTML từ CKEditor |
| excerpt | text | null |
| status | PostStatus | DRAFT, PUBLISHED, index |
| show_on_landing | boolean | default false, index |
| published_at | timestamptz | null |
| seo_title | string | null |
| seo_description | string | null |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Không có danh mục bài viết. Xóa mềm đổi `slug` thành `deleted.{id}`.
