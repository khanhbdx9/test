# banners

- Trạng thái: Chưa làm
- Module: banners

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| title | string | |
| desktop_image_url | string | |
| mobile_image_url | string | null |
| link | string | null |
| position | string | index |
| sort_order | int | default 0 |
| starts_at | timestamptz | null |
| ends_at | timestamptz | null |
| is_active | boolean | default true, index |
| created_at | timestamptz | |
| updated_at | timestamptz | |
