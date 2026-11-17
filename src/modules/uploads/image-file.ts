import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';

export const MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_UPLOAD_FILES = 20;

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const SIGNATURES: Record<
  string,
  { extension: string; matches: (file: Buffer) => boolean }
> = {
  'image/jpeg': {
    extension: '.jpg',
    matches: (file) => file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff,
  },
  'image/png': {
    extension: '.png',
    matches: (file) => file.subarray(0, PNG.length).equals(PNG),
  },
  'image/webp': {
    extension: '.webp',
    matches: (file) =>
      file.subarray(0, 4).toString('ascii') === 'RIFF' &&
      file.subarray(8, 12).toString('ascii') === 'WEBP',
  },
};

export function assertImageFile(file: {
  mimetype: string;
  size: number;
  buffer: Buffer;
}): string {
  const signature = SIGNATURES[file.mimetype];
  if (!signature || !signature.matches(file.buffer)) {
    throw new BadRequestException(MESSAGES.INVALID_IMAGE);
  }
  return signature.extension;
}

export function assertTotalUploadSize(
  files: { size: number }[],
): void {
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_UPLOAD_BYTES) {
    throw new BadRequestException(MESSAGES.FILE_TOO_LARGE);
  }
}
