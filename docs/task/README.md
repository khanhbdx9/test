# Task theo module

Mỗi module một thư mục. `database/` là từng bảng. `feature/` là từng tính năng. Làm lần lượt một tính năng, không gộp.

| Thứ tự | Module | Tính năng | Database | Trạng thái |
|---|---|---|---|---|
| 01 | health | Kiểm tra dịch vụ | — | Xong |
| 02 | auth | Đăng nhập | — | Xong |
| 03 | auth | Phiên đăng nhập | refresh_tokens | Xong |
| 04 | auth | Tài khoản hiện tại | — | Xong |
| 05 | users | Danh sách | users | Xong |
| 06 | users | Tạo và cập nhật | users | Xong |
| 07 | users | Xóa mềm | users | Xong |
| 08 | users | Khóa | users | Xong |
| 09 | users | Gán role | users | Xong |
| 10 | roles | CRUD role | roles | Xong |
| 11 | roles | Gán permission | role_permissions | Xong |
| 12 | permissions | Danh sách quyền | permissions | Xong |
| 13 | categories | Danh mục | categories | Xong |
| 13.1 | categories | Danh mục công khai | categories | Xong |
| 14 | product | Sản phẩm | products | Xong |
| 15 | product | Hình ảnh | product_images | Xong |
| 16 | product | Biến thể | product_variants | Xong |
| 16.1 | product | Sản phẩm công khai | products | Xong |
| 17 | posts | Danh mục bài viết | post_categories | Bỏ qua |
| 18 | posts | Bài viết HTML CKEditor + landing | posts | Xong |
| 19 | themes | Giao diện | themes | Xong |
| 20 | banners | Banner | banners | Xong |
| 20.1 | public | Storefront khách hàng | — | Xong |
| 20.2 | public | Lọc storefront (`POST /public/filter`) | — | Xong |
| 21 | customers | Hồ sơ | customers | Chưa làm |
| 22 | customers | Địa chỉ | customer_addresses | Chưa làm |
| 23 | orders | Tạo đơn (đơn giản) | orders | Xong |
| 23.1 | orders / mail | Email đơn mới (`EMAIL_NOTIFICATION`, nhiều `;`) | system_configs | Xong |
| 23.2 | notifications | Thông báo đơn mới in-app | notifications | Xong |
| 24 | orders | Trạng thái (đơn giản) | orders | Xong |
| 25 | customers | Lịch sử mua | — | Chưa làm |
| 26 | reports | Doanh thu | — | Chưa làm |
| 27 | uploads | Upload ảnh | — | Xong |
| 28 | audit-logs | Nhật ký | audit_logs | Chưa làm |
| 29 | system-configs | CRUD cấu hình | system_configs | Xong |

Module đã build chi tiết: `.cursor/rules/built-modules.mdc`.
