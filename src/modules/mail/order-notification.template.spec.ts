import {
  FulfillmentMethod,
  OrderStatus,
  PaymentMethod,
} from '../../generated/prisma/client';
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
    fulfillmentMethod: FulfillmentMethod.DELIVERY,
    status: OrderStatus.PENDING_CONFIRMATION,
    deliveryDate: '2026-11-25',
    deliveryTime: '09:00-11:00',
    totalAmount: '299000.00',
    items: [
      {
        id: 'item-1',
        productId: '22222222-2222-4222-8222-222222222222',
        variantId: '33333333-3333-4333-8333-333333333333',
        quantity: 1,
        unitPrice: '299000.00',
        lineTotal: '299000.00',
        productName: 'Bánh Vanilla',
        productSku: 'CAKE-1',
        variantSku: 'CAKE-1-S',
        size: 'S',
        style: 'Tròn',
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
