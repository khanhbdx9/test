# Sản phẩm

- Thứ tự: 14
- Trạng thái: Xong
- Module: product
- Database: `database/products.md`
- Phụ thuộc: categories

## Phạm vi

CRUD sản phẩm. Giá là Decimal. `salePrice` nhỏ hơn `price`. Slug và SKU unique.

## API

`GET|POST /api/v1/products`, `GET|PATCH|DELETE /api/v1/products/:id`

Quyền `products.view|create|update|delete`. Lọc search, status, categoryId, isFeatured, isBestSeller.

Trạng thái: `DRAFT`, `PUBLISHED`, `HIDDEN`. Danh sách ưu tiên `isFeatured`, rồi `createdAt` mới nhất.

## Ngoài phạm vi

Ảnh nằm ở `feature/hinh-anh.md`. Biến thể nằm ở `feature/bien-the.md`.
