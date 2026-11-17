# Biến thể sản phẩm

- Thứ tự: 16
- Trạng thái: Xong
- Module: product
- Database: `database/product-variants.md`
- Phụ thuộc: `feature/san-pham.md`

## Phạm vi

SKU riêng, kích thước, mẫu, giá, trạng thái, thứ tự. Kích thước và mẫu là chuỗi. Thay toàn bộ biến thể khi tạo hoặc cập nhật sản phẩm, trong một transaction.

## API

Mảng `variants` trong `POST` và `PATCH /api/v1/products`. Chi tiết sản phẩm trả danh sách biến thể.

## Ngoài phạm vi

Đơn hàng.
