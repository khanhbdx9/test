import { MailService } from './mail.service';
import {
  FulfillmentMethod,
  OrderStatus,
  PaymentMethod,
} from '../../generated/prisma/client';
import { SYSTEM_CONFIG_KEYS } from '../system-configs/system-config.keys';

describe('MailService', () => {
  const systemConfigsService = {
    findValueByKey: jest.fn(),
  };
  const configService = {
    get: jest.fn(),
  };

  const order = {
    id: '11111111-1111-4111-8111-111111111111',
    email: null,
    phone: '0901234567',
    shippingAddress: null,
    fullName: 'Khách',
    note: null,
    paymentMethod: PaymentMethod.AT_STORE,
    paymentImageUrl: null,
    fulfillmentMethod: FulfillmentMethod.PICKUP,
    status: OrderStatus.PENDING_CONFIRMATION,
    deliveryDate: null,
    deliveryTime: null,
    totalAmount: '100000.00',
    items: [
      {
        id: 'item-1',
        productId: '22222222-2222-4222-8222-222222222222',
        variantId: '33333333-3333-4333-8333-333333333333',
        quantity: 1,
        unitPrice: '100000.00',
        lineTotal: '100000.00',
        productName: 'Bánh',
        productSku: 'P1',
        variantSku: 'P1-S',
        size: 'S',
        style: 'Tròn',
        imageUrl: null,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('bỏ qua khi thiếu EMAIL_NOTIFICATION', async () => {
    systemConfigsService.findValueByKey.mockResolvedValue(null);
    const service = new MailService(
      configService as never,
      systemConfigsService as never,
    );
    await service.notifyNewOrder(order);
    expect(systemConfigsService.findValueByKey).toHaveBeenCalledWith(
      SYSTEM_CONFIG_KEYS.EMAIL_NOTIFICATION,
    );
    expect(configService.get).not.toHaveBeenCalled();
  });

  it('parse nhiều email phân tách bằng ;', () => {
    const service = new MailService(
      configService as never,
      systemConfigsService as never,
    );
    expect(
      service.parseNotificationEmails(
        ' a@shop.local ; b@shop.local; ;c@shop.local ',
      ),
    ).toEqual(['a@shop.local', 'b@shop.local', 'c@shop.local']);
    expect(service.parseNotificationEmails(null)).toEqual([]);
    expect(service.parseNotificationEmails('  ;  ')).toEqual([]);
  });
});
