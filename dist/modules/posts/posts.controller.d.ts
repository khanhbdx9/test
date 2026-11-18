import { AuthenticatedUser } from '../auth/authenticated-user';
import { CreatePostDto } from './dto/create-post.dto';
import { DeletedPostResponseDto, PostResponseDto } from './dto/post-response.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(query: QueryPostDto): Promise<{
        items: PostResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<PostResponseDto>;
    create(user: AuthenticatedUser, dto: CreatePostDto): Promise<PostResponseDto>;
    update(id: string, dto: UpdatePostDto): Promise<PostResponseDto>;
    publish(id: string): Promise<PostResponseDto>;
    remove(id: string): Promise<DeletedPostResponseDto>;
}
