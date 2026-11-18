import { PostStatus } from '../../../generated/prisma/client';
export declare class CreatePostDto {
    title: string;
    slug?: string;
    thumbnailUrl?: string | null;
    content: string;
    excerpt?: string;
    status?: PostStatus;
    showOnLanding?: boolean;
    seoTitle?: string;
    seoDescription?: string;
}
