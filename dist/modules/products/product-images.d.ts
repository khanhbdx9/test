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
export declare function normalizeProductImages(images: ProductImageInput[]): ProductImageWrite[];
