import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';

export interface ProductImageInput {
  url: string;
  alt?: string;
  sortOrder?: number;
  isCover?: boolean;
}

export interface ProductImageWrite {
  url: string;
  alt: string | null;
  sortOrder: number;
  isCover: boolean;
}

export function normalizeProductImages(
  images: ProductImageInput[],
): ProductImageWrite[] {
  const coverCount = images.filter((image) => image.isCover === true).length;
  if (coverCount > 1) {
    throw new BadRequestException(MESSAGES.INVALID_COVER);
  }

  const writes = images.map((image, index) => ({
    url: image.url,
    alt: image.alt ?? null,
    sortOrder: image.sortOrder ?? index,
    isCover: image.isCover === true,
  }));

  if (coverCount === 0 && writes.length > 0) {
    let pick = 0;
    for (let index = 1; index < writes.length; index += 1) {
      if (writes[index].sortOrder < writes[pick].sortOrder) {
        pick = index;
      }
    }
    writes[pick].isCover = true;
  }

  return writes;
}
