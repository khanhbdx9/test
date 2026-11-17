# Sản phẩm công khai

- Trạng thái: Xong
- Module: product
- Database: `database/products.md`
- Phụ thuộc: `feature/san-pham.md`, `feature/hinh-anh.md`, `feature/bien-the.md`

## Phạm vi

Đọc sản phẩm không cần token. Chỉ trả `status = PUBLISHED` và danh mục `VISIBLE`.

Danh sách theo danh mục (`categoryId` hoặc `categorySlug`), có phân trang. Sắp xếp: nổi bật trước, rồi sản phẩm mới theo `createdAt`.

Chi tiết theo `/{categorySlug}/{productSlug}`. Sản phẩm liên quan cùng danh mục, loại trừ sản phẩm hiện tại.

## API

- `GET /api/v1/public/products`
- `GET /api/v1/public/products/:categorySlug/:productSlug`
- `GET /api/v1/public/products/:categorySlug/:productSlug/related`

## Ngoài phạm vi

Tạo, sửa, xóa.
