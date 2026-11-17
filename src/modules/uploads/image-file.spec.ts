import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import {
  assertImageFile,
  assertTotalUploadSize,
  MAX_TOTAL_UPLOAD_BYTES,
} from './image-file';

describe('assertImageFile', () => {
  it('nhận JPEG đúng chữ ký', () => {
    expect(
      assertImageFile({
        mimetype: 'image/jpeg',
        size: 3,
        buffer: Buffer.from([0xff, 0xd8, 0xff]),
      }),
    ).toBe('.jpg');
  });

  it('từ chối file không phải ảnh', () => {
    expect(() =>
      assertImageFile({
        mimetype: 'image/png',
        size: 4,
        buffer: Buffer.from('text'),
      }),
    ).toThrow(new BadRequestException(MESSAGES.INVALID_IMAGE));
  });
});

describe('assertTotalUploadSize', () => {
  it('cho phép tổng dung lượng trong 10MB', () => {
    expect(() =>
      assertTotalUploadSize([{ size: 4 * 1024 * 1024 }, { size: 4 * 1024 * 1024 }]),
    ).not.toThrow();
  });

  it('từ chối khi tổng vượt 10MB', () => {
    expect(() =>
      assertTotalUploadSize([
        { size: MAX_TOTAL_UPLOAD_BYTES },
        { size: 1 },
      ]),
    ).toThrow(new BadRequestException(MESSAGES.FILE_TOO_LARGE));
  });
});
