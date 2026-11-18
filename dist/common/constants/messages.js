"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = void 0;
exports.messageForStatus = messageForStatus;
exports.MESSAGES = {
    SUCCESS: 'Thành công',
    CREATED: 'Tạo mới thành công',
    FETCH_SUCCESS: 'Lấy dữ liệu thành công',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
    UNAUTHORIZED: 'Bạn chưa đăng nhập',
    FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    CONFLICT: 'Dữ liệu đã tồn tại',
    INTERNAL_ERROR: 'Đã xảy ra lỗi hệ thống',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa',
    SYSTEM_ROLE_PROTECTED: 'Không thể sửa hoặc xóa role hệ thống',
    ROLE_IN_USE: 'Role đang được sử dụng',
    PRIVILEGE_ESCALATION: 'Không thể gán quyền cao hơn quyền hiện tại',
    SUPER_ADMIN_PROTECTED: 'Không thể thay đổi tài khoản quản trị hệ thống',
    SELF_LOCK: 'Không thể khóa tài khoản đang đăng nhập',
    SELF_DELETE: 'Không thể xóa tài khoản đang đăng nhập',
    EMAIL_IN_USE: 'Email đã được sử dụng',
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    UPDATE_SUCCESS: 'Cập nhật thành công',
    DELETE_SUCCESS: 'Xóa thành công',
    SLUG_IN_USE: 'Slug đã được sử dụng',
    CATEGORY_HAS_CHILDREN: 'Danh mục đang có danh mục con',
    INVALID_PARENT: 'Không thể chọn danh mục này làm danh mục cha',
    SKU_IN_USE: 'SKU đã được sử dụng',
    INVALID_SALE_PRICE: 'Giá khuyến mãi phải nhỏ hơn giá bán',
    INVALID_COVER: 'Chỉ được chọn một ảnh đại diện',
    FILE_REQUIRED: 'Cần chọn file ảnh',
    INVALID_IMAGE: 'Chỉ nhận ảnh JPEG, PNG hoặc WEBP',
    FILE_TOO_LARGE: 'Tổng dung lượng ảnh vượt quá 10MB',
    DUPLICATE_VARIANT_SKU: 'SKU biến thể bị trùng',
    UPLOAD_FOLDER_INVALID: 'Folder không hợp lệ',
    DELIVERY_DATE_REQUIRED: 'Ngày giao hàng bắt buộc khi thanh toán chuyển khoản',
    CONFIG_KEY_IN_USE: 'Key cấu hình đã tồn tại',
    PRODUCTS_REQUIRED: 'Đơn hàng cần ít nhất một sản phẩm',
    PRODUCT_NOT_FOUND: 'Một hoặc nhiều sản phẩm không hợp lệ',
    THEME_CODE_IN_USE: 'Mã theme đã tồn tại',
    THEME_NOT_FOUND: 'Không tìm thấy theme',
    BANNER_NOT_FOUND: 'Không tìm thấy banner',
    NOTIFICATION_NOT_FOUND: 'Không tìm thấy thông báo',
    POST_SLUG_IN_USE: 'Slug bài viết đã tồn tại',
    POST_NOT_FOUND: 'Không tìm thấy bài viết',
    SEARCH_QUERY_REQUIRED: 'Từ khóa tìm kiếm không được để trống',
};
const STATUS_MESSAGES = {
    200: exports.MESSAGES.SUCCESS,
    201: exports.MESSAGES.CREATED,
    400: exports.MESSAGES.VALIDATION_ERROR,
    401: exports.MESSAGES.UNAUTHORIZED,
    403: exports.MESSAGES.FORBIDDEN,
    404: exports.MESSAGES.NOT_FOUND,
    409: exports.MESSAGES.CONFLICT,
    500: exports.MESSAGES.INTERNAL_ERROR,
};
function messageForStatus(statusCode) {
    return STATUS_MESSAGES[statusCode] ?? exports.MESSAGES.SUCCESS;
}
//# sourceMappingURL=messages.js.map