import {
  OrderProductItemDto,
  OrderResponseDto,
} from '../orders/dto/order-response.dto';
import {
  OrderStatus,
  PaymentMethod,
} from '../../generated/prisma/client';

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  AT_STORE: 'Thanh toán tại cửa hàng',
  BANK_TRANSFER: 'Chuyển khoản',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  REJECTED: 'Từ chối',
  CONFIRMED: 'Đã xác nhận',
  NEED_CALLBACK: 'Cần liên hệ lại',
  COMPLETED: 'Hoàn thành',
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatMoney(value: string): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return value;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

function productRows(products: OrderProductItemDto[]): string {
  if (products.length === 0) {
    return `<tr><td colspan="3" style="padding:12px;border-bottom:1px solid #eee;color:#666;">Không có sản phẩm</td></tr>`;
  }
  return products
    .map((product, index) => {
      const name = escapeHtml(product.name);
      const sku = escapeHtml(product.sku);
      const price = escapeHtml(formatMoney(product.unitPrice));
      const thumb = product.imageUrl
        ? `<img src="${escapeHtml(product.imageUrl)}" alt="${name}" width="48" height="48" style="display:block;border-radius:6px;object-fit:cover;border:1px solid #eee;" />`
        : `<div style="width:48px;height:48px;border-radius:6px;background:#f3f1ec;border:1px solid #eee;"></div>`;
      return `<tr>
  <td style="padding:12px 8px;border-bottom:1px solid #eee;vertical-align:top;">${index + 1}</td>
  <td style="padding:12px 8px;border-bottom:1px solid #eee;vertical-align:top;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;vertical-align:top;">${thumb}</td>
      <td style="vertical-align:top;">
        <div style="font-weight:600;color:#1f1a17;">${name}</div>
        <div style="font-size:12px;color:#6b6560;margin-top:4px;">SKU: ${sku}</div>
      </td>
    </tr></table>
  </td>
  <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;vertical-align:top;white-space:nowrap;">${price}</td>
</tr>`;
    })
    .join('');
}

export function buildOrderNotificationText(order: OrderResponseDto): string {
  const lines = [
    'Đơn hàng mới từ website Minh Sam',
    `Mã đơn: ${order.id}`,
    `Thời gian tạo: ${formatDateTime(order.createdAt)}`,
    `Trạng thái: ${STATUS_LABEL[order.status]}`,
    '',
    'Khách hàng',
    `- Họ tên: ${order.fullName ?? '-'}`,
    `- SĐT: ${order.phone}`,
    `- Email: ${order.email ?? '-'}`,
    `- Địa chỉ: ${order.shippingAddress}`,
    '',
    'Thanh toán & giao hàng',
    `- Phương thức: ${PAYMENT_LABEL[order.paymentMethod]}`,
    `- Ngày giao: ${order.deliveryDate ?? '-'}`,
    `- Giờ giao: ${order.deliveryTime ?? '-'}`,
    `- Ảnh chuyển khoản: ${order.paymentImageUrl ?? '-'}`,
    `- Ghi chú: ${order.note ?? '-'}`,
    '',
    'Sản phẩm',
    ...order.products.map(
      (product, index) =>
        `${index + 1}. ${product.name} (${product.sku}) — ${formatMoney(product.unitPrice)}`,
    ),
    '',
    `Tổng tiền: ${formatMoney(order.totalAmount)}`,
  ];
  return lines.join('\n');
}

export function buildOrderNotificationHtml(order: OrderResponseDto): string {
  const fullName = escapeHtml(order.fullName ?? '-');
  const phone = escapeHtml(order.phone);
  const email = escapeHtml(order.email ?? '-');
  const address = escapeHtml(order.shippingAddress);
  const note = escapeHtml(order.note ?? '-');
  const deliveryDate = escapeHtml(order.deliveryDate ?? '-');
  const deliveryTime = escapeHtml(order.deliveryTime ?? '-');
  const payment = escapeHtml(PAYMENT_LABEL[order.paymentMethod]);
  const status = escapeHtml(STATUS_LABEL[order.status]);
  const total = escapeHtml(formatMoney(order.totalAmount));
  const createdAt = escapeHtml(formatDateTime(order.createdAt));
  const orderId = escapeHtml(order.id);
  const paymentImage = order.paymentImageUrl
    ? `<a href="${escapeHtml(order.paymentImageUrl)}" style="color:#8b3a2b;text-decoration:underline;">Xem ảnh chuyển khoản</a>`
    : '-';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Đơn hàng mới</title>
</head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Arial,Helvetica,sans-serif;color:#1f1a17;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ed;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e2d9;">
          <tr>
            <td style="background:#8b3a2b;padding:20px 24px;">
              <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">Minh Sam</div>
              <div style="margin-top:6px;font-size:14px;color:#f7e8e3;">Thông báo đơn hàng mới</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">
                Có đơn hàng mới cần xử lý. Chi tiết như sau:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background:#faf7f3;border-radius:8px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <div style="font-size:12px;color:#6b6560;text-transform:uppercase;letter-spacing:0.4px;">Mã đơn</div>
                    <div style="margin-top:4px;font-size:14px;font-weight:600;">${orderId}</div>
                    <div style="margin-top:10px;font-size:13px;color:#6b6560;">Tạo lúc ${createdAt} · ${status}</div>
                  </td>
                </tr>
              </table>

              <h2 style="margin:0 0 10px;font-size:15px;color:#8b3a2b;">Khách hàng</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #eee;border-radius:8px;">
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;width:140px;color:#6b6560;">Họ tên</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${fullName}</td></tr>
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b6560;">Số điện thoại</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${phone}</td></tr>
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b6560;">Email</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${email}</td></tr>
                <tr><td style="padding:10px 12px;color:#6b6560;">Địa chỉ giao</td><td style="padding:10px 12px;">${address}</td></tr>
              </table>

              <h2 style="margin:0 0 10px;font-size:15px;color:#8b3a2b;">Thanh toán & giao hàng</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #eee;border-radius:8px;">
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;width:140px;color:#6b6560;">Phương thức</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${payment}</td></tr>
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b6560;">Ngày giao</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${deliveryDate}</td></tr>
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b6560;">Giờ giao</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${deliveryTime}</td></tr>
                <tr><td style="padding:10px 12px;border-bottom:1px solid #eee;color:#6b6560;">Ảnh CK</td><td style="padding:10px 12px;border-bottom:1px solid #eee;">${paymentImage}</td></tr>
                <tr><td style="padding:10px 12px;color:#6b6560;">Ghi chú</td><td style="padding:10px 12px;">${note}</td></tr>
              </table>

              <h2 style="margin:0 0 10px;font-size:15px;color:#8b3a2b;">Sản phẩm</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;border:1px solid #eee;border-radius:8px;border-collapse:collapse;">
                <tr style="background:#faf7f3;">
                  <th align="left" style="padding:10px 8px;font-size:12px;color:#6b6560;font-weight:600;">#</th>
                  <th align="left" style="padding:10px 8px;font-size:12px;color:#6b6560;font-weight:600;">Sản phẩm</th>
                  <th align="right" style="padding:10px 8px;font-size:12px;color:#6b6560;font-weight:600;">Giá</th>
                </tr>
                ${productRows(order.products)}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                <tr>
                  <td align="right" style="padding:12px 0;font-size:16px;font-weight:700;color:#8b3a2b;">
                    Tổng tiền: ${total}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px;background:#faf7f3;border-top:1px solid #eee;font-size:12px;color:#6b6560;text-align:center;">
              Email tự động từ hệ thống quản lý Minh Sam. Vui lòng không trả lời email này.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
