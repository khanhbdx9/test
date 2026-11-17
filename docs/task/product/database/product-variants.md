# product_variants

- Trạng thái: Xong
- Module: product

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK products, onDelete Cascade, index |
| sku | string | unique |
| size | string | admin nhập, không enum |
| style | string | admin nhập, không enum |
| price | decimal(12,2) | |
| sale_price | decimal(12,2) | null, nhỏ hơn price |
| status | VariantStatus | ACTIVE, INACTIVE |
| sort_order | int | default 0 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Xóa mềm sản phẩm đổi `sku` biến thể thành `deleted.{id}`.
