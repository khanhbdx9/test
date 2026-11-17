import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { normalizeProductVariants } from './product-variants';

describe('normalizeProductVariants', () => {
  it('giữ kích thước và mẫu là chuỗi, mặc định đang bán', () => {
    const variants = normalizeProductVariants([
      {
        sku: 'BK-16',
        size: '16cm',
        style: 'Dâu',
        price: '250000',
      },
    ]);

    expect(variants[0].size).toBe('16cm');
    expect(variants[0].style).toBe('Dâu');
    expect(variants[0].status).toBe('ACTIVE');
    expect(variants[0].price.toFixed(2)).toBe('250000.00');
  });

  it('từ chối SKU trùng và giá khuyến mãi không nhỏ hơn giá bán', () => {
    expect(() =>
      normalizeProductVariants([
        { sku: 'BK-16', size: '16cm', style: 'Dâu', price: '100000' },
        { sku: 'BK-16', size: '20cm', style: 'Dâu', price: '120000' },
      ]),
    ).toThrow(new BadRequestException(MESSAGES.DUPLICATE_VARIANT_SKU));

    expect(() =>
      normalizeProductVariants([
        {
          sku: 'BK-20',
          size: '20cm',
          style: 'Socola',
          price: '100000',
          salePrice: '100000',
        },
      ]),
    ).toThrow(new BadRequestException(MESSAGES.INVALID_SALE_PRICE));
  });
});
