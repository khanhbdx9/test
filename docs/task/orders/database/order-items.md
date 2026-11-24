# order_items

- Trạng thái: Xong
- Module: orders
- Phụ thuộc: `orders.md`, products / product_variants

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK → orders, cascade delete, index |
| product_id | uuid | snapshot id sản phẩm, index |
| variant_id | uuid | snapshot id biến thể, index |
| quantity | int | ≥ 1 |
| unit_price | decimal(12,2) | giá hiệu lực biến thể lúc đặt (`salePrice ?? price`) |
| product_name | string | snapshot |
| product_sku | string | snapshot |
| variant_sku | string | snapshot |
| size | string | snapshot |
| style | string | snapshot |
| image_url | string | null — ảnh cover lúc đặt |
| created_at | timestamptz | hệ thống |
| updated_at | timestamptz | hệ thống |

Không FK tới `products` / `product_variants` (tránh lỗi khi cập nhật/xóa mềm catalog). Giữ snapshot để CMS/email xem đúng lúc đặt.
