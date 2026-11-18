import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma, Theme } from '../../generated/prisma/client';
import { CreateThemeDto } from './dto/create-theme.dto';
import { QueryThemeDto } from './dto/query-theme.dto';
import {
  DeletedThemeResponseDto,
  ThemeResponseDto,
} from './dto/theme-response.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryThemeDto): Promise<{
    items: ThemeResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.ThemeWhereInput = {};
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.theme.count({ where }),
      this.prisma.theme.findMany({
        where,
        orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: rows.map((row) => this.toResponse(row)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findOne(id: string): Promise<ThemeResponseDto> {
    return this.toResponse(await this.getTheme(id));
  }

  async findActive(): Promise<ThemeResponseDto | null> {
    const theme = await this.prisma.theme.findFirst({
      where: { isActive: true },
    });
    return theme ? this.toResponse(theme) : null;
  }

  async create(dto: CreateThemeDto): Promise<ThemeResponseDto> {
    try {
      const theme = await this.prisma.$transaction(async (tx) => {
        if (dto.isActive) {
          await tx.theme.updateMany({
            where: { isActive: true },
            data: { isActive: false },
          });
        }
        return tx.theme.create({
          data: {
            name: dto.name,
            code: dto.code,
            description: dto.description ?? null,
            config: dto.config as Prisma.InputJsonValue,
            previewUrl: dto.previewUrl ?? null,
            isActive: dto.isActive ?? false,
          },
        });
      });
      return this.toResponse(theme);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(id: string, dto: UpdateThemeDto): Promise<ThemeResponseDto> {
    await this.getTheme(id);
    try {
      const theme = await this.prisma.$transaction(async (tx) => {
        if (dto.isActive === true) {
          await tx.theme.updateMany({
            where: { isActive: true, NOT: { id } },
            data: { isActive: false },
          });
        }
        return tx.theme.update({
          where: { id },
          data: {
            name: dto.name,
            code: dto.code,
            description: dto.description,
            config:
              dto.config === undefined
                ? undefined
                : (dto.config as Prisma.InputJsonValue),
            previewUrl: dto.previewUrl,
            isActive: dto.isActive,
          },
        });
      });
      return this.toResponse(theme);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async remove(id: string): Promise<DeletedThemeResponseDto> {
    await this.getTheme(id);
    await this.prisma.theme.delete({ where: { id } });
    return { id };
  }

  private async getTheme(id: string): Promise<Theme> {
    const theme = await this.prisma.theme.findUnique({ where: { id } });
    if (!theme) {
      throw new NotFoundException(MESSAGES.THEME_NOT_FOUND);
    }
    return theme;
  }

  private toResponse(theme: Theme): ThemeResponseDto {
    return {
      id: theme.id,
      name: theme.name,
      code: theme.code,
      description: theme.description,
      config: (theme.config ?? {}) as Record<string, unknown>,
      previewUrl: theme.previewUrl,
      isActive: theme.isActive,
      createdAt: theme.createdAt,
      updatedAt: theme.updatedAt,
    };
  }

  private rethrowUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(MESSAGES.THEME_CODE_IN_USE);
    }
    throw error;
  }
}
