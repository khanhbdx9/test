import { buildPagination } from '../../common/utils/pagination.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { QuerySystemConfigDto } from './dto/query-system-config.dto';
import { DeletedSystemConfigResponseDto, SystemConfigResponseDto } from './dto/system-config-response.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
export declare class SystemConfigsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QuerySystemConfigDto): Promise<{
        items: SystemConfigResponseDto[];
        pagination: ReturnType<typeof buildPagination>;
    }>;
    findOne(id: string): Promise<SystemConfigResponseDto>;
    findValueByKey(key: string): Promise<string | null>;
    create(dto: CreateSystemConfigDto): Promise<SystemConfigResponseDto>;
    update(id: string, dto: UpdateSystemConfigDto): Promise<SystemConfigResponseDto>;
    remove(id: string): Promise<DeletedSystemConfigResponseDto>;
    private getById;
    private rethrowUnique;
}
