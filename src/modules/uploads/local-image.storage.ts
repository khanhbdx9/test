import { Injectable } from '@nestjs/common';
import { mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ImageStorage } from './image-storage';

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class LocalImageStorage implements ImageStorage {
  async save(file: {
    buffer: Buffer;
    extension: string;
    folder: string;
  }): Promise<{ relativePath: string }> {
    const folder = this.assertInsideUploads(file.folder);
    const absoluteFolder = folder ? join(UPLOAD_DIR, folder) : UPLOAD_DIR;
    await mkdir(absoluteFolder, { recursive: true });
    const filename = `${randomUUID()}${file.extension}`;
    const relativePath = folder ? `${folder}/${filename}` : filename;
    await writeFile(join(UPLOAD_DIR, relativePath), file.buffer);
    return { relativePath };
  }

  async removeRelativePaths(paths: string[]): Promise<void> {
    for (const path of paths) {
      const relative = this.assertInsideUploads(path);
      try {
        await unlink(join(UPLOAD_DIR, relative));
      } catch {
        // file có thể đã bị xóa
      }
    }
  }

  async removeFolder(folder: string): Promise<void> {
    const relative = this.assertInsideUploads(folder);
    if (!relative) {
      return;
    }
    try {
      await rm(join(UPLOAD_DIR, relative), { recursive: true, force: true });
    } catch {
      // folder có thể chưa tồn tại
    }
  }

  private assertInsideUploads(relativePath: string): string {
    const normalized = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
    if (normalized.includes('..')) {
      throw new Error('Đường dẫn upload không hợp lệ');
    }
    if (!normalized) {
      return '';
    }
    const absolute = resolve(UPLOAD_DIR, normalized);
    if (!absolute.startsWith(resolve(UPLOAD_DIR))) {
      throw new Error('Đường dẫn upload không hợp lệ');
    }
    return normalized;
  }
}
