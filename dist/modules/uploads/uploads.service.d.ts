import { ImageStorage } from './image-storage';
export declare const IMAGE_STORAGE = "IMAGE_STORAGE";
export interface IncomingImage {
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class UploadsService {
    private readonly storage;
    constructor(storage: ImageStorage);
    saveImages(files: IncomingImage[] | undefined, baseUrl: string, folder?: string): Promise<{
        url: string;
    }[]>;
    removeFolder(folder: string): Promise<void>;
    removeUnusedImageUrls(previousUrls: string[], nextUrls: string[]): Promise<void>;
}
