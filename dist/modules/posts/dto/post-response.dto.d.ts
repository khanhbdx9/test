import { PostStatus } from '../../../generated/prisma/client';
export declare class PostAuthorDto {
    id: string;
    fullName: string;
}
export declare class PostResponseDto {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    content: string;
    excerpt: string | null;
    status: PostStatus;
    showOnLanding: boolean;
    publishedAt: Date | null;
    seoTitle: string | null;
    seoDescription: string | null;
    author: PostAuthorDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeletedPostResponseDto {
    id: string;
}
