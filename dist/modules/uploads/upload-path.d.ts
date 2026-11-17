export declare function assertSafeSlug(value: string, label: string): string;
export declare function normalizeUploadFolder(folder: string): string;
export declare function resolveUploadFolder(folder?: string | null): string;
export declare function productUploadFolder(categorySlug: string, productSlug: string): string;
export declare function relativePathFromUploadUrl(url: string): string | null;
export declare function folderFromUploadUrl(url: string): string | null;
