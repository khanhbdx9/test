# Doanh thu / dashboard biểu đồ

- Thứ tự: 26
- Trạng thái: Xong
- Module: reports
- Phụ thuộc: orders, order_items

## Phạm vi

Tổng hợp dữ liệu cho biểu đồ vận hành cửa hàng. Doanh thu chỉ tính đơn `COMPLETED`.

Query **bắt buộc**: `from`, `to` (lọc `createdAt`). Tùy chọn `topLimit` (mặc định 10).

Trả về:

- `summary`: tổng doanh thu COMPLETED, tổng đơn (mọi status), số đơn COMPLETED, AOV
- `ordersByStatus`: số đơn theo từng trạng thái
- `revenueByDay` / `revenueByMonth`: chuỗi thời gian doanh thu COMPLETED
- `topProducts`: sản phẩm bán chạy theo số lượng (kèm doanh thu dòng)

## API

- `GET /api/v1/reports/dashboard` quyền `reports.view`
- `GET /api/v1/reports/revenue` quyền `reports.view` (alias cùng payload)

## Ngoài phạm vi

Export Excel, PAID (không có status này).
