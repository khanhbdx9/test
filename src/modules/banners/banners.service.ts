import { Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Banner, Prisma } from '../../generated/prisma/client';
import { BannerResponseDto, DeletedBannerResponseDto } from './dto/banner-response.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto, QueryPublicBannerDto } from './dto/query-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryBannerDto): Promise<{
    items: BannerResponseDto[];
    pagination: ReturnType<typeof buildPagination>;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.BannerWhereInput = {};
    if (query.position) {
      where.position = query.position;
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.banner.count({ where }),
      this.prisma.banner.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items: rows.map((row) => this.toResponse(row)),
      pagination: buildPagination(page, limit, total),
    };
  }

  async findActive(query: QueryPublicBannerDto): Promise<BannerResponseDto[]> {
    const now = new Date();
    const where: Prisma.BannerWhereInput = {
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    };
    if (query.position) {
      where.position = query.position;
    }

    const rows = await this.prisma.banner.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return rows.map((row) => this.toResponse(row));
  }

  async findOne(id: string): Promise<BannerResponseDto> {
    return this.toResponse(await this.getBanner(id));
  }

  async create(dto: CreateBannerDto): Promise<BannerResponseDto> {
    const banner = await this.prisma.banner.create({
      data: {
        title: dto.title,
        desktopImageUrl: dto.desktopImageUrl,
        mobileImageUrl: dto.mobileImageUrl ?? null,
        link: dto.link ?? null,
        position: dto.position,
        sortOrder: dto.sortOrder ?? 0,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        isActive: dto.isActive ?? true,
      },
    });
    return this.toResponse(banner);
  }

  async update(id: string, dto: UpdateBannerDto): Promise<BannerResponseDto> {
    await this.getBanner(id);
    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        title: dto.title,
        desktopImageUrl: dto.desktopImageUrl,
        mobileImageUrl: dto.mobileImageUrl,
        link: dto.link,
        position: dto.position,
        sortOrder: dto.sortOrder,
        startsAt:
          dto.startsAt === undefined
            ? undefined
            : dto.startsAt
              ? new Date(dto.startsAt)
              : null,
        endsAt:
          dto.endsAt === undefined
            ? undefined
            : dto.endsAt
              ? new Date(dto.endsAt)
              : null,
        isActive: dto.isActive,
      },
    });
    return this.toResponse(banner);
  }

  async remove(id: string): Promise<DeletedBannerResponseDto> {
    await this.getBanner(id);
    await this.prisma.banner.delete({ where: { id } });
    return { id };
  }

  private async getBanner(id: string): Promise<Banner> {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(MESSAGES.BANNER_NOT_FOUND);
    }
    return banner;
  }

  private toResponse(banner: Banner): BannerResponseDto {
    return {
      id: banner.id,
      title: banner.title,
      desktopImageUrl: banner.desktopImageUrl,
      mobileImageUrl: banner.mobileImageUrl,
      link: banner.link,
      position: banner.position,
      sortOrder: banner.sortOrder,
      startsAt: banner.startsAt,
      endsAt: banner.endsAt,
      isActive: banner.isActive,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    };
  }
}
