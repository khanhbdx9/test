import { slugify } from './slug.util';

describe('slugify', () => {
  it('đổi tiếng Việt và khoảng trắng thành slug', () => {
    expect(slugify('  Bánh Kem Dâu  ')).toBe('banh-kem-dau');
  });

  it('bỏ ký tự đầu cuối và giữ số', () => {
    expect(slugify('---Bánh 16cm---')).toBe('banh-16cm');
  });
});