# Doanh thu

- Thứ tự: 26
- Trạng thái: Chưa làm
- Module: reports
- Phụ thuộc: orders trạng thái

## Phạm vi

Doanh thu chỉ tính đơn `COMPLETED` và `PAID`. Không tính đơn hủy.

Tổng doanh thu, tổng số đơn, số đơn theo trạng thái, sản phẩm bán chạy, doanh thu theo ngày và theo tháng. Lọc `from` và `to`.

## API

`GET /api/v1/reports/revenue` quyền `reports.view`

## Ngoài phạm vi

Export Excel.
