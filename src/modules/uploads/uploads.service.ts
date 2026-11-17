import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { assertImageFile, assertTotalUploadSize } from './image-file';
import { ImageStorage } from './image-storage';
import {
  normalizeUploadFolder,
  relativePathFromUploadUrl,
  resolveUploadFolder,
} from './upload-path';

export const IMAGE_STORAGE = 'IMAGE_STORAGE';

export interface IncomingImage {
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadsService {
  constructor(@Inject(IMAGE_STORAGE) private readonly storage: ImageStorage) {}

  async saveImages(
    files: IncomingImage[] | undefined,
    baseUrl: string,
    folder?: string,
  ): Promise<{ url: string }[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException(MESSAGES.FILE_REQUIRED);
    }
    assertTotalUploadSize(files);
    const target = resolveUploadFolder(folder);

    const results: { url: string }[] = [];
    for (const file of files) {
      const extension = assertImageFile(file);
      const saved = await this.storage.save({
        buffer: file.buffer,
        extension,
        folder: target,
      });
      results.push({ url: `${baseUrl}/uploads/${saved.relativePath}` });
    }
    return results;
  }

  async removeFolder(folder: string): Promise<void> {
    await this.storage.removeFolder(normalizeUploadFolder(folder));
  }

  async removeUnusedImageUrls(
    previousUrls: string[],
    nextUrls: string[],
  ): Promise<void> {
    const kept = new Set(nextUrls);
    const paths = previousUrls
      .filter((url) => !kept.has(url))
      .map((url) => relativePathFromUploadUrl(url))
      .filter((path): path is string => path !== null);
    if (paths.length > 0) {
      await this.storage.removeRelativePaths(paths);
    }
  }
}
