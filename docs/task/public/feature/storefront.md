# API public storefront (khách hàng)

- Thứ tự: 20.1
- Trạng thái: Xong
- Module: public

## Phạm vi

Gom toàn bộ API public vào một controller (`PublicStorefrontController`), tag Swagger `Public`:

- `GET /api/v1/public/categories`, `GET /api/v1/public/categories/:id`
- `GET /api/v1/public/categories/:categorySlug/products` — sản phẩm theo slug danh mục, phân trang + `search`
- `GET /api/v1/public/products`, `GET /api/v1/public/products/:categorySlug/:productSlug`, `.../related`
- `GET /api/v1/public/products/:categorySlug/related-other` — tối đa 10 SP category khác, mỗi category ≥1 nếu có
- `POST /api/v1/public/filter` — xem `feature/tim-kiem.md`
- `POST /api/v1/public/orders/create`
- `GET /api/v1/public/p-con/qr` — config `QR_PAYMENT`
- `POST /api/v1/public/upload/qr/pay` — upload ảnh chứng từ thanh toán vào `payments/qr`
- `GET /api/v1/public/theme`
- `GET /api/v1/public/banners`
- `GET /api/v1/public/posts`
  - `search`: lọc theo tên bài viết
  - `sortCreated`: `asc` | `desc` (mặc định `desc`)
  - `landing`: mặc định `false` (mọi bài published); `true` chỉ bài `showOnLanding`
- `GET /api/v1/public/posts/:slug`
- `GET /api/v1/public/posts/:slug/related` — bài viết liên quan
