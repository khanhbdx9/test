import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { DeletedPostResponseDto, PostResponseDto } from './dto/post-response.dto';
import { QueryPostDto, QueryPublicPostDto, QueryRelatedPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryPostDto): Promise<{
        items: PostResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findPublished(query: QueryPublicPostDto): Promise<{
        items: PostResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<PostResponseDto>;
    findPublishedBySlug(slug: string): Promise<PostResponseDto>;
    findRelated(slug: string, query: QueryRelatedPostDto): Promise<{
        items: PostResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    private extractTitleKeywords;
    create(authorId: string, dto: CreatePostDto): Promise<PostResponseDto>;
    update(id: string, dto: UpdatePostDto): Promise<PostResponseDto>;
    publish(id: string): Promise<PostResponseDto>;
    remove(id: string): Promise<DeletedPostResponseDto>;
    private getActive;
    private resolveSlug;
    private toResponse;
    private rethrowUnique;
}
