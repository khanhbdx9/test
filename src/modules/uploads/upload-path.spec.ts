import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import {
  folderFromUploadUrl,
  normalizeUploadFolder,
  productUploadFolder,
  relativePathFromUploadUrl,
  resolveUploadFolder,
} from './upload-path';

describe('upload-path', () => {
  it('chuẩn hóa folder do client truyền', () => {
    expect(normalizeUploadFolder(' Products/Banh-Kem/Banh-Dau-16/ ')).toBe(
      'products/banh-kem/banh-dau-16',
    );
  });

  it('folder tùy chọn: trống thì lưu root uploads', () => {
    expect(resolveUploadFolder(undefined)).toBe('');
    expect(resolveUploadFolder('')).toBe('');
    expect(resolveUploadFolder(' banners/home ')).toBe('banners/home');
  });

  it('từ chối folder nguy hiểm', () => {
    expect(() => normalizeUploadFolder('../etc')).toThrow(
      new BadRequestException(MESSAGES.UPLOAD_FOLDER_INVALID),
    );
  });

  it('ghép folder sản phẩm và đọc path từ URL', () => {
    expect(productUploadFolder('banh-kem', 'banh-dau-16')).toBe(
      'products/banh-kem/banh-dau-16',
    );
    expect(
      relativePathFromUploadUrl(
        'http://localhost:3000/uploads/products/banh-kem/banh-dau-16/a.jpg',
      ),
    ).toBe('products/banh-kem/banh-dau-16/a.jpg');
    expect(
      folderFromUploadUrl('http://localhost:3000/uploads/a.jpg'),
    ).toBe('');
  });
});
