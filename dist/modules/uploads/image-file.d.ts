export declare const MAX_TOTAL_UPLOAD_BYTES: number;
export declare const MAX_UPLOAD_FILES = 20;
export declare function assertImageFile(file: {
    mimetype: string;
    size: number;
    buffer: Buffer;
}): string;
export declare function assertTotalUploadSize(files: {
    size: number;
}[]): void;
