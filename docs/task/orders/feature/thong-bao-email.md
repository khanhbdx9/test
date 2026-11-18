# Thông báo email đơn mới

- Thứ tự: 23.1
- Trạng thái: Xong
- Module: orders / mail
- Database: `../system-configs/database/system-configs.md`
- Phụ thuộc: `feature/tao-don.md`, system-configs

## Phạm vi

Sau khi `POST /public/orders/create` thành công, gửi email HTML (table + inline CSS) cho chủ cửa hàng.

- Địa chỉ từ `system_configs` key `EMAIL_NOTIFICATION`
- Nhiều email: phân tách bằng `;`, trim khoảng trắng, bỏ phần rỗng
- Nội dung: khách, thanh toán, giao hàng, sản phẩm, tổng tiền
- SMTP từ biến môi trường
- Lỗi gửi mail không làm fail tạo đơn

## Ngoài phạm vi

Hàng đợi mail, attachment PDF. Thông báo in-app xem module `notifications`.
