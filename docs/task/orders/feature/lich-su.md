# Lịch sử đơn hàng (CMS)

- Thứ tự: 25
- Trạng thái: Xong
- Module: orders
- Database: `database/orders.md`
- Phụ thuộc: `feature/tao-don.md`, `feature/trang-thai.md`

## Phạm vi

Danh sách đơn đã kết thúc: chỉ `REJECTED` và `COMPLETED`. Quyền `orders.view`.

Query **bắt buộc**: `page`, `limit`, `createdFrom`, `createdTo` (lọc theo `created_at`, inclusive theo ngày).

Query tùy chọn: `search` (SĐT/email), `deliveryDate`, `deliveryTime`, `status` (chỉ trong `REJECTED` | `COMPLETED`; bỏ trống = cả hai). Luôn sort `createdAt` mới nhất trước.

## API

- `GET /api/v1/orders/history` quyền `orders.view`

## Ngoài phạm vi

Đơn đang xử lý (`PENDING_CONFIRMATION`, `CONFIRMED`, …) — dùng `GET /orders`.
