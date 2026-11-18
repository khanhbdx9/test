import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { QuerySystemConfigDto } from './dto/query-system-config.dto';
import {
  DeletedSystemConfigResponseDto,
  SystemConfigResponseDto,
} from './dto/system-config-response.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';

const configSelect = {
  id: true,
  key: true,
  value: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SystemConfigsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySystemConfigDto): Promise<{
    items: SystemConfigResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.SystemConfigWhereInput = {};
    if (query.search) {
      where.OR = [
        { key: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.systemConfig.count({ where }),
      this.prisma.systemConfig.findMany({
        where,
        select: configSelect,
        orderBy: { key: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { items, pagination: buildPagination(page, limit, total) };
  }

  async findOne(id: string): Promise<SystemConfigResponseDto> {
    return this.getById(id);
  }

  async findValueByKey(key: string): Promise<string | null> {
    const row = await this.prisma.systemConfig.findUnique({
      where: { key },
      select: { value: true },
    });
    const value = row?.value?.trim();
    return value ? value : null;
  }

  async create(dto: CreateSystemConfigDto): Promise<SystemConfigResponseDto> {
    try {
      return await this.prisma.systemConfig.create({
        data: {
          key: dto.key,
          value: dto.value,
          description: dto.description ?? null,
        },
        select: configSelect,
      });
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(
    id: string,
    dto: UpdateSystemConfigDto,
  ): Promise<SystemConfigResponseDto> {
    await this.getById(id);
    return this.prisma.systemConfig.update({
      where: { id },
      data: {
        value: dto.value,
        description:
          dto.description === undefined ? undefined : dto.description,
      },
      select: configSelect,
    });
  }

  async remove(id: string): Promise<DeletedSystemConfigResponseDto> {
    await this.getById(id);
    await this.prisma.systemConfig.delete({ where: { id } });
    return { id };
  }

  private async getById(id: string): Promise<SystemConfigResponseDto> {
    const row = await this.prisma.systemConfig.findUnique({
      where: { id },
      select: configSelect,
    });
    if (!row) {
      throw new NotFoundException(MESSAGES.NOT_FOUND);
    }
    return row;
  }

  private rethrowUnique(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(MESSAGES.CONFIG_KEY_IN_USE);
    }
    throw error;
  }
}
