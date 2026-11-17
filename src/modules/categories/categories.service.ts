import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { slugify } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CategoryStatus, Prisma } from '../../generated/prisma/client';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { QueryPublicCategoryDto } from './dto/query-public-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const categorySelect = {
  id: true,
  parentId: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  status: true,
  sortOrder: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryCategoryDto): Promise<{
    items: CategoryResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.CategoryWhereInput = { deletedAt: null };
    if (query.status) {
      where.status = query.status;
    }
    if (query.parentId) {
      where.parentId = query.parentId;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
        where,
        select: categorySelect,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { items, pagination: buildPagination(page, limit, total) };
  }

  findVisible(query: QueryPublicCategoryDto): Promise<{
    items: CategoryResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    return this.findAll({ ...query, status: CategoryStatus.VISIBLE });
  }

  async findVisibleOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null, status: CategoryStatus.VISIBLE },
      select: categorySelect,
    });
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    return this.getActive(id);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    await this.assertParent(dto.parentId);
    const slug = this.resolveSlug(dto.slug, dto.name);
    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          imageUrl: dto.imageUrl,
          status: dto.status,
          sortOrder: dto.sortOrder,
          seoTitle: dto.seoTitle,
          seoDescription: dto.seoDescription,
          parentId: dto.parentId,
        },
        select: categorySelect,
      });
    } catch (error) {
      this.rethrowSlugConflict(error);
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const current = await this.getActive(id);
    if (dto.parentId !== undefined) {
      await this.assertParent(dto.parentId, id);
    }
    const data: Prisma.CategoryUpdateInput = {};
    if (dto.name !== undefined) {
      data.name = dto.name;
    }
    if (dto.slug !== undefined) {
      data.slug = this.resolveSlug(dto.slug, dto.name ?? current.name);
    }
    if (dto.description !== undefined) {
      data.description = dto.description;
    }
    if (dto.imageUrl !== undefined) {
      data.imageUrl = dto.imageUrl;
    }
    if (dto.status !== undefined) {
      data.status = dto.status;
    }
    if (dto.sortOrder !== undefined) {
      data.sortOrder = dto.sortOrder;
    }
    if (dto.seoTitle !== undefined) {
      data.seoTitle = dto.seoTitle;
    }
    if (dto.seoDescription !== undefined) {
      data.seoDescription = dto.seoDescription;
    }
    if (dto.parentId !== undefined) {
      data.parent = dto.parentId
        ? { connect: { id: dto.parentId } }
        : { disconnect: true };
    }
    if (Object.keys(data).length === 0) {
      return current;
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data,
        select: categorySelect,
      });
    } catch (error) {
      this.rethrowSlugConflict(error);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.getActive(id);
    const children = await this.prisma.category.count({
      where: { parentId: id, deletedAt: null },
    });
    if (children > 0) {
      throw new ConflictException(MESSAGES.CATEGORY_HAS_CHILDREN);
    }
    await this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        slug: `deleted.${id}`,
      },
    });
    return { id };
  }

  private async getActive(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      select: categorySelect,
    });
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  private async assertParent(
    parentId: string | null | undefined,
    categoryId?: string,
  ): Promise<void> {
    if (!parentId) {
      return;
    }
    const seen = new Set<string>();
    let current: string | null = parentId;
    while (current) {
      if (current === categoryId || seen.has(current)) {
        throw new BadRequestException(MESSAGES.INVALID_PARENT);
      }
      seen.add(current);
      const parent: { parentId: string | null } | null =
        await this.prisma.category.findFirst({
          where: { id: current, deletedAt: null },
          select: { parentId: true },
        });
      if (!parent) {
        throw new NotFoundException();
      }
      current = parent.parentId;
    }
  }

  private resolveSlug(slug: string | undefined, name: string): string {
    const resolved = slug && slug.length > 0 ? slug : slugify(name);
    if (!resolved) {
      throw new BadRequestException('Slug không hợp lệ');
    }
    return resolved;
  }

  private rethrowSlugConflict(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(MESSAGES.SLUG_IN_USE);
    }
    throw error;
  }
}
