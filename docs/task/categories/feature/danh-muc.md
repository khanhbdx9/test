# Danh mục cha con

- Thứ tự: 13
- Trạng thái: Xong
- Module: categories
- Database: `database/categories.md`

## Phạm vi

CRUD danh mục. Cây cha con. Slug, mô tả, ảnh URL tùy chọn, trạng thái, thứ tự, SEO. Không xóa khi còn con. Không chọn chính nó hoặc con cháu làm cha.

## API

`GET|POST /api/v1/categories`, `GET|PATCH|DELETE /api/v1/categories/:id`

Quyền `categories.view|create|update|delete`. Phân trang, search, lọc status và parentId.

## Ngoài phạm vi

Sản phẩm. Upload file.
