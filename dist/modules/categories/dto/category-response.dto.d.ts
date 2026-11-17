import { CategoryStatus } from '../../../generated/prisma/client';
export declare class CategoryResponseDto {
    id: string;
    parentId: string | null;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    status: CategoryStatus;
    sortOrder: number;
    seoTitle: string | null;
    seoDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeletedCategoryResponseDto {
    id: string;
}
