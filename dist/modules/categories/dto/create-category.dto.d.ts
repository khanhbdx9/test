import { CategoryStatus } from '../../../generated/prisma/client';
export declare class CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string | null;
    status?: CategoryStatus;
    sortOrder?: number;
    seoTitle?: string;
    seoDescription?: string;
    parentId?: string | null;
}
