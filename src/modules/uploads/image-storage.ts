export interface ImageStorage {
  save(file: {
    buffer: Buffer;
    extension: string;
    folder: string;
  }): Promise<{ relativePath: string }>;

  removeRelativePaths(paths: string[]): Promise<void>;

  removeFolder(folder: string): Promise<void>;
}
