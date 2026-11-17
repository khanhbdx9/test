# product_images

- Trạng thái: Xong
- Module: product

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK products, onDelete Cascade, index |
| url | string | |
| alt | string | null |
| sort_order | int | default 0 |
| is_cover | boolean | default false, một ảnh đại diện mỗi sản phẩm |
| created_at | timestamptz | |
| updated_at | timestamptz | |
