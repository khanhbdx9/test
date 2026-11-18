import { MailService } from './mail.service';
import { OrderStatus, PaymentMethod } from '../../generated/prisma/client';
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
    shippingAddress: 'A',
    fullName: null,
    note: null,
    paymentMethod: PaymentMethod.AT_STORE,
    paymentImageUrl: null,
    status: OrderStatus.PENDING_CONFIRMATION,
    deliveryDate: null,
    deliveryTime: null,
    productIds: ['22222222-2222-4222-8222-222222222222'],
    totalAmount: '100000.00',
    products: [
      {
        id: '22222222-2222-4222-8222-222222222222',
        sku: 'P1',
        name: 'Bánh',
        unitPrice: '100000.00',
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

