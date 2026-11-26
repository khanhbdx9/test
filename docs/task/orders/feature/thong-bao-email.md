# Thông báo email đơn mới

- Thứ tự: 23.1
- Trạng thái: Xong
- Module: orders / mail
- Database: `../system-configs/database/system-configs.md`
- Phụ thuộc: `feature/tao-don.md`, system-configs

## Phạm vi

Sau khi `POST /public/orders/create` thành công, gửi email HTML (table + inline CSS) cho chủ cửa hàng.

- **Địa chỉ nhận** từ `system_configs` key `EMAIL_NOTIFICATION`
- Nhiều email: phân tách bằng `;` hoặc `,`, trim, bỏ rỗng, lowercase, unique
- Nội dung: khách, thanh toán, giao hàng / nhận hàng, dòng hàng, tổng tiền
- **SMTP gửi** từ biến môi trường `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (thiếu → log warn, không gửi, không fail đơn)
- Gửi mail + in-app notification chạy nền sau khi tạo đơn (`Promise.allSettled`) — không làm chậm/502 response
- Lỗi gửi mail không làm fail tạo đơn
- SMTP có `connectionTimeout`/`socketTimeout` để tránh treo khi Gmail/proxy chậm

## Lưu ý vận hành

Thiếu `SMTP_*` trong `.env` thì đơn vẫn tạo nhưng **không có email**. Kiểm tra log: `SMTP chưa đủ` hoặc `Đã gửi mail đơn ...`.

## Ngoài phạm vi

Hàng đợi mail, attachment PDF. Thông báo in-app xem module `notifications`.
