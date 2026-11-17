# Upload ảnh

- Thứ tự: 27
- Trạng thái: Xong
- Module: uploads

## Phạm vi

Upload nhiều ảnh một lần qua field `files`. Query `folder` tùy chọn, ví dụ `products/banh-kem/banh-dau-16` hoặc `banners/home`. Không truyền thì lưu trực tiếp trong `uploads/`.

Lưu local tại `uploads/{folder?}/{uuid}.ext`. Segment folder chỉ gồm chữ thường, số, dấu gạch ngang. Chỉ `image/jpeg`, `image/png`, `image/webp`. Tổng dung lượng tối đa 10MB mỗi request. Tối đa 20 file. Trả mảng URL.

Khi sản phẩm đổi ảnh hoặc xóa, module products xóa file/folder `products/{categorySlug}/{productSlug}` nếu dùng đúng quy ước đó.

## API

`POST /api/v1/uploads/images`

`POST /api/v1/uploads/images?folder=products/banh-kem/banh-dau-16`

User đã đăng nhập và có một trong các quyền `products.create`, `posts.create`, `banners.manage`, `themes.manage`.

## Ngoài phạm vi

S3, Cloudinary.
