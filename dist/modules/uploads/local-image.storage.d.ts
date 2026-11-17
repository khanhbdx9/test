import { ImageStorage } from './image-storage';
export declare const UPLOAD_DIR: string;
export declare class LocalImageStorage implements ImageStorage {
    save(file: {
        buffer: Buffer;
        extension: string;
        folder: string;
    }): Promise<{
        relativePath: string;
    }>;
    removeRelativePaths(paths: string[]): Promise<void>;
    removeFolder(folder: string): Promise<void>;
    private assertInsideUploads;
}
