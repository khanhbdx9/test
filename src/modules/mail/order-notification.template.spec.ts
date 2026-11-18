import { OrderStatus, PaymentMethod } from '../../generated/prisma/client';
import {
  buildOrderNotificationHtml,
  buildOrderNotificationText,
} from './order-notification.template';

describe('order-notification.template', () => {
  const order = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'khach@example.com',
    phone: '0901234567',
    shippingAddress: '12 Lê Lợi',
    fullName: 'Nguyễn Văn A',
    note: 'Giao sáng',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentImageUrl: 'https://cdn.example.com/bill.jpg',
    status: OrderStatus.PENDING_CONFIRMATION,
    deliveryDate: '2026-11-25',
    deliveryTime: '09:00-11:00',
    productIds: ['22222222-2222-4222-8222-222222222222'],
    totalAmount: '299000.00',
    products: [
      {
        id: '22222222-2222-4222-8222-222222222222',
        sku: 'CAKE-1',
        name: 'Bánh Vanilla',
        unitPrice: '299000.00',
        imageUrl: 'https://cdn.example.com/cake.jpg',
      },
    ],
    createdAt: new Date('2026-11-18T10:00:00.000Z'),
    updatedAt: new Date('2026-11-18T10:00:00.000Z'),
  };

  it('html có bảng sản phẩm và tổng tiền', () => {
    const html = buildOrderNotificationHtml(order);
    expect(html).toContain('Minh Sam');
    expect(html).toContain('Bánh Vanilla');
    expect(html).toContain('Tổng tiền');
    expect(html).toContain('table');
  });

  it('text có thông tin khách và sản phẩm', () => {
    const text = buildOrderNotificationText(order);
    expect(text).toContain('0901234567');
    expect(text).toContain('Bánh Vanilla');
    expect(text).toContain('Tổng tiền');
  });
});
