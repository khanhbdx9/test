import { BadRequestException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';

const SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertSafeSlug(value: string, label: string): string {
  const slug = value.trim().toLowerCase();
  if (!SEGMENT.test(slug)) {
    throw new BadRequestException(`${label} không hợp lệ`);
  }
  return slug;
}

export function normalizeUploadFolder(folder: string): string {
  const normalized = folder
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();
  if (!normalized) {
    throw new BadRequestException(MESSAGES.UPLOAD_FOLDER_INVALID);
  }
  const segments = normalized.split('/').filter((part) => part.length > 0);
  if (segments.length === 0 || segments.length > 8) {
    throw new BadRequestException(MESSAGES.UPLOAD_FOLDER_INVALID);
  }
  for (const segment of segments) {
    if (segment === '.' || segment === '..' || !SEGMENT.test(segment)) {
      throw new BadRequestException(MESSAGES.UPLOAD_FOLDER_INVALID);
    }
  }
  return segments.join('/');
}

export function resolveUploadFolder(folder?: string | null): string {
  if (folder === undefined || folder === null || folder.trim() === '') {
    return '';
  }
  return normalizeUploadFolder(folder);
}

export function productUploadFolder(
  categorySlug: string,
  productSlug: string,
): string {
  return normalizeUploadFolder(
    `products/${assertSafeSlug(categorySlug, 'Slug danh mục')}/${assertSafeSlug(productSlug, 'Slug sản phẩm')}`,
  );
}

export function relativePathFromUploadUrl(url: string): string | null {
  try {
    const pathname = url.startsWith('http') ? new URL(url).pathname : url;
    const marker = '/uploads/';
    const index = pathname.indexOf(marker);
    if (index < 0) {
      return null;
    }
    const relative = pathname.slice(index + marker.length);
    if (!relative || relative.includes('..')) {
      return null;
    }
    return relative;
  } catch {
    return null;
  }
}

export function folderFromUploadUrl(url: string): string | null {
  const relative = relativePathFromUploadUrl(url);
  if (!relative) {
    return null;
  }
  const parts = relative.split('/');
  if (parts.length < 2) {
    return '';
  }
  return parts.slice(0, -1).join('/');
}
