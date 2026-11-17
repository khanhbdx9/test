# Danh mục công khai

- Thứ tự: 13
- Trạng thái: Xong
- Module: categories
- Database: `database/categories.md`

## Phạm vi

Đọc danh mục không cần token. Chỉ trả `status = VISIBLE` và chưa xóa. Phân trang, search, lọc `parentId`.

## API

- `GET /api/v1/public/categories`
- `GET /api/v1/public/categories/:id`

Danh mục `HIDDEN` hoặc đã xóa trả 404 ở chi tiết và không có trong danh sách.

## Ngoài phạm vi

Tạo, sửa, xóa.
