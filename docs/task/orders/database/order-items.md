# order_items

- Trạng thái: Chưa làm
- Module: orders

Snapshot tại thời điểm đặt. Không đọc lại giá sản phẩm khi xem đơn.

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| order_id | uuid | FK orders, onDelete Cascade, index |
| product_id | uuid | null, FK products, onDelete SetNull |
| variant_id | uuid | null, FK product_variants, onDelete SetNull |
| product_name | string | snapshot |
| sku | string | snapshot |
| variant_size | string | null, snapshot |
| variant_style | string | null, snapshot |
| unit_price | decimal(12,2) | snapshot |
| quantity | int | |
| line_total | decimal(12,2) | |
| created_at | timestamptz | |
