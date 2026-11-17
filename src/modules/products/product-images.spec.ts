import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { normalizeProductImages } from './product-images';

describe('normalizeProductImages', () => {
  it('chọn ảnh sort nhỏ nhất làm đại diện khi chưa chọn', () => {
    const images = normalizeProductImages([
      { url: 'https://cdn.example.com/b.jpg', sortOrder: 2 },
      { url: 'https://cdn.example.com/a.jpg', sortOrder: 1 },
    ]);

    expect(images.find((image) => image.isCover)?.url).toBe(
      'https://cdn.example.com/a.jpg',
    );
  });

  it('giữ ảnh được chọn làm đại diện', () => {
    const images = normalizeProductImages([
      { url: 'https://cdn.example.com/a.jpg', isCover: false },
      { url: 'https://cdn.example.com/b.jpg', isCover: true },
    ]);

    expect(images.filter((image) => image.isCover)).toHaveLength(1);
    expect(images[1].isCover).toBe(true);
  });

  it('từ chối nhiều ảnh đại diện', () => {
    expect(() =>
      normalizeProductImages([
        { url: 'https://cdn.example.com/a.jpg', isCover: true },
        { url: 'https://cdn.example.com/b.jpg', isCover: true },
      ]),
    ).toThrow(new BadRequestException(MESSAGES.INVALID_COVER));
  });
});
