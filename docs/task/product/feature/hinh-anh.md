# Hình ảnh sản phẩm

- Thứ tự: 15
- Trạng thái: Xong
- Module: product
- Database: `database/product-images.md`
- Phụ thuộc: `feature/san-pham.md`, uploads

## Phạm vi

Nhiều ảnh cho một sản phẩm. Mỗi ảnh có `url`, `alt`, `sortOrder`, `isCover`. Chỉ một ảnh `isCover`. Không chọn thì ảnh `sortOrder` nhỏ nhất thành ảnh đại diện. Thay toàn bộ ảnh khi tạo hoặc cập nhật sản phẩm, trong một transaction.

Nên upload với `folder=products/{categorySlug}/{productSlug}`. Cập nhật ảnh thì xóa file cũ không còn dùng. Đổi slug/category hoặc xóa sản phẩm thì xóa folder quy ước đó.

## API

Mảng `images` trong `POST` và `PATCH /api/v1/products`. Chi tiết sản phẩm trả danh sách ảnh.

Upload file: `POST /api/v1/uploads/images?folder=products/{categorySlug}/{productSlug}`.

## Ngoài phạm vi

Biến thể.
