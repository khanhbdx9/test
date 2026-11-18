import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { slugify } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Post, PostStatus, Prisma } from '../../generated/prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import {
  DeletedPostResponseDto,
  PostResponseDto,
} from './dto/post-response.dto';
import {
  QueryPostDto,
  QueryPublicPostDto,
  QueryRelatedPostDto,
} from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

type PostWithAuthor = Post & {
  author: { id: string; fullName: string };
};

const authorSelect = {
  id: true,
  fullName: true,
} as const;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPostDto): Promise<{
    items: PostResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.PostWhereInput = { deletedAt: null };
    if (query.status) {
      where.status = query.status;
    }
    if (query.showOnLanding !== undefined) {
      where.showOnLanding = query.showOnLanding;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        include: { author: { select: authorSelect } },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: rows.map((row) => this.toResponse(row)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findPublished(query: QueryPublicPostDto): Promise<{
    items: PostResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortCreated = query.sortCreated ?? 'desc';
    const landing = query.landing ?? false;

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      status: PostStatus.PUBLISHED,
    };
    if (landing) {
      where.showOnLanding = true;
    }
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        include: { author: { select: authorSelect } },
        orderBy: { createdAt: sortCreated },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: rows.map((row) => this.toResponse(row)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(id: string): Promise<PostResponseDto> {
    return this.toResponse(await this.getActive(id));
  }

  async findPublishedBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: PostStatus.PUBLISHED,
      },
      include: { author: { select: authorSelect } },
    });
    if (!post) {
      throw new NotFoundException(MESSAGES.POST_NOT_FOUND);
    }
    return this.toResponse(post);
  }

  async findRelated(
    slug: string,
    query: QueryRelatedPostDto,
  ): Promise<{
    items: PostResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const current = await this.prisma.post.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: PostStatus.PUBLISHED,
      },
      select: { id: true, title: true },
    });
    if (!current) {
      throw new NotFoundException(MESSAGES.POST_NOT_FOUND);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const keywords = this.extractTitleKeywords(current.title);

    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      status: PostStatus.PUBLISHED,
      id: { not: current.id },
      ...(keywords.length > 0
        ? {
            OR: keywords.map((word) => ({
              title: { contains: word, mode: 'insensitive' as const },
            })),
          }
        : {}),
    };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        include: { author: { select: authorSelect } },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Không khớp từ khóa → fallback bài published gần nhất (trừ bài hiện tại)
    if (total === 0 && keywords.length > 0) {
      const fallbackWhere: Prisma.PostWhereInput = {
        deletedAt: null,
        status: PostStatus.PUBLISHED,
        id: { not: current.id },
      };
      const [fallbackTotal, fallbackRows] = await this.prisma.$transaction([
        this.prisma.post.count({ where: fallbackWhere }),
        this.prisma.post.findMany({
          where: fallbackWhere,
          include: { author: { select: authorSelect } },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);
      return {
        items: fallbackRows.map((row) => this.toResponse(row)),
        pagination: buildPagination(page, limit, fallbackTotal),
      };
    }

    return {
      items: rows.map((row) => this.toResponse(row)),
      pagination: buildPagination(page, limit, total),
    };
  }

  private extractTitleKeywords(title: string): string[] {
    const stopWords = new Set([
      'va',
      'và',
      'cua',
      'của',
      'cho',
      'voi',
      'với',
      'cac',
      'các',
      'mot',
      'một',
      'nhung',
      'những',
      'the',
      'and',
      'for',
      'with',
    ]);
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((word) => word.trim())
      .filter((word) => word.length >= 3 && !stopWords.has(word))
      .slice(0, 5);
  }

  async create(
    authorId: string,
    dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const slug = this.resolveSlug(dto.slug, dto.title);
    const status = dto.status ?? PostStatus.DRAFT;
    try {
      const post = await this.prisma.post.create({
        data: {
          authorId,
          title: dto.title,
          slug,
          thumbnailUrl: dto.thumbnailUrl ?? null,
          content: dto.content,
          excerpt: dto.excerpt ?? null,
          status,
          showOnLanding: dto.showOnLanding ?? false,
          publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
          seoTitle: dto.seoTitle ?? null,
          seoDescription: dto.seoDescription ?? null,
        },
        include: { author: { select: authorSelect } },
      });
      return this.toResponse(post);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(id: string, dto: UpdatePostDto): Promise<PostResponseDto> {
    const current = await this.getActive(id);
    const nextStatus = dto.status ?? current.status;
    const slug =
      dto.slug !== undefined || dto.title !== undefined
        ? this.resolveSlug(dto.slug, dto.title ?? current.title)
        : undefined;

    try {
      const post = await this.prisma.post.update({
        where: { id },
        data: {
          title: dto.title,
          slug,
          thumbnailUrl: dto.thumbnailUrl,
          content: dto.content,
          excerpt: dto.excerpt,
          status: dto.status,
          showOnLanding: dto.showOnLanding,
          publishedAt:
            nextStatus === PostStatus.PUBLISHED
              ? (current.publishedAt ?? new Date())
              : dto.status === PostStatus.DRAFT
                ? null
                : undefined,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
        },
        include: { author: { select: authorSelect } },
      });
      return this.toResponse(post);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async publish(id: string): Promise<PostResponseDto> {
    await this.getActive(id);
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: { author: { select: authorSelect } },
    });
    return this.toResponse(post);
  }

  async remove(id: string): Promise<DeletedPostResponseDto> {
    await this.getActive(id);
    await this.prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        slug: `deleted.${id}`,
        status: PostStatus.DRAFT,
        publishedAt: null,
      },
    });
    return { id };
  }

  private async getActive(id: string): Promise<PostWithAuthor> {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: { author: { select: authorSelect } },
    });
    if (!post) {
      throw new NotFoundException(MESSAGES.POST_NOT_FOUND);
    }
    return post;
  }

  private resolveSlug(slug: string | undefined, title: string): string {
    return (slug?.trim() || slugify(title)).toLowerCase();
  }

  private toResponse(post: PostWithAuthor): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      thumbnailUrl: post.thumbnailUrl,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      showOnLanding: post.showOnLanding,
      publishedAt: post.publishedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private rethrowUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(MESSAGES.POST_SLUG_IN_USE);
    }
    throw error;
  }
}
