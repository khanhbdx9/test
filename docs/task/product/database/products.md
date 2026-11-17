# products

- Trạng thái: Xong
- Module: product

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| category_id | uuid | FK categories, onDelete Restrict, index |
| sku | string | unique |
| name | string | |
| slug | string | unique |
| short_description | text | null |
| description | text | null |
| price | decimal(12,2) | |
| sale_price | decimal(12,2) | null, nhỏ hơn price |
| status | ProductStatus | DRAFT, PUBLISHED, HIDDEN, index |
| is_featured | boolean | default false |
| is_best_seller | boolean | default false, cờ admin đặt |
| seo_title | string | null |
| seo_description | string | null |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | null, index |

Xóa mềm đổi `slug` và `sku` thành `deleted.{id}`.
