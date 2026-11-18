# Bài viết

- Thứ tự: 18
- Trạng thái: Xong
- Module: posts
- Database: `database/posts.md`

## API admin

`GET|POST /api/v1/posts`, `GET|PATCH|DELETE /api/v1/posts/:id`, `PATCH /api/v1/posts/:id/publish`

Quyền: `posts.view|create|update|delete|publish`.

| Field | Ghi chú |
|---|---|
| `content` | HTML từ CKEditor |
| `showOnLanding` | boolean, mặc định `false` — đánh dấu hiển thị trên landing |
| (không có) | danh mục bài viết — đã bỏ |

Admin list hỗ trợ filter `search`, `status`, `showOnLanding`.

## API public

- `GET /api/v1/public/posts`
  - `search`: lọc theo **tên** bài viết
  - `sortCreated`: `asc` \| `desc` (mặc định `desc`)
  - `landing`: mặc định `false` → mọi bài `PUBLISHED`; `true` → chỉ bài `showOnLanding = true`
- `GET /api/v1/public/posts/:slug`
- `GET /api/v1/public/posts/:slug/related` — bài liên quan (khớp từ khóa tiêu đề; fallback bài published mới nhất), phân trang `page`/`limit`
