# Lọc storefront

- Thứ tự: 20.2
- Trạng thái: Xong
- Module: public

## API

`POST /api/v1/public/filter` — HTTP 200 (không tạo resource).

Body:

| Field | Bắt buộc | Mô tả |
|---|---|---|
| `search` | không | Từ khóa (tên, sku, slug, mô tả, tên danh mục) |
| `page`, `limit` | không | Phân trang (limit mặc định 12) |
| `categoryId` | không | Lọc danh mục (UUID). Không dùng `categorySlug` |
| `minPrice`, `maxPrice` | không | Lọc theo giá hiệu lực (`salePrice` nếu có) |
| `sortBy` | không | Cột bảng `products`: `name`, `sku`, `slug`, `price`, `salePrice`, `createdAt`, `updatedAt`, `isFeatured`, `isBestSeller` (mặc định `createdAt`) |
| `sort` | không | `asc` \| `desc` (mặc định `desc`) |

Response:

- `search` — từ khóa đã áp dụng (null nếu không truyền)
- `products` + `pagination` — kết quả chính
- `categories` / `posts` — gợi ý khi có `search`
- `suggestions` — gợi ý nhanh type `category` \| `product` \| `post`
