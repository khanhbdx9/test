# Sản phẩm công khai

- Trạng thái: Xong
- Module: product
- Database: `database/products.md`
- Phụ thuộc: `feature/san-pham.md`, `feature/hinh-anh.md`, `feature/bien-the.md`

## Phạm vi

Đọc sản phẩm không cần token. Chỉ trả `status = PUBLISHED` và danh mục `VISIBLE`.

Danh sách theo danh mục (`categoryId` / `categorySlug` query, hoặc `GET .../categories/:categorySlug/products`), có phân trang và tìm kiếm (`search` theo tên/SKU/slug). Sắp xếp: nổi bật trước, rồi sản phẩm mới theo `createdAt`.

Chi tiết theo `/{categorySlug}/{productSlug}`.

Sản phẩm liên quan:

- Cùng danh mục: `.../related` (loại trừ sản phẩm hiện tại)
- Danh mục khác: `GET .../products/:categorySlug/related-other` — tối đa 10 SP không thuộc `categorySlug`; round-robin mỗi category khác lấy tối thiểu 1 (nếu có).

## API

- `GET /api/v1/public/products`
- `GET /api/v1/public/categories/:categorySlug/products` — query `page`, `limit`, `search`
- `GET /api/v1/public/products/:categorySlug/:productSlug`
- `GET /api/v1/public/products/:categorySlug/:productSlug/related`
- `GET /api/v1/public/products/:categorySlug/related-other`

## Ngoài phạm vi

Tạo, sửa, xóa.
