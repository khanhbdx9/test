import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { QuerySystemConfigDto } from './dto/query-system-config.dto';
import { DeletedSystemConfigResponseDto, SystemConfigResponseDto } from './dto/system-config-response.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { SystemConfigsService } from './system-configs.service';
export declare class SystemConfigsController {
    private readonly systemConfigsService;
    constructor(systemConfigsService: SystemConfigsService);
    findAll(query: QuerySystemConfigDto): Promise<{
        items: SystemConfigResponseDto[];
        pagination: ReturnType<typeof import("../../common/utils/pagination.util").buildPagination>;
    }>;
    findOne(id: string): Promise<SystemConfigResponseDto>;
    create(dto: CreateSystemConfigDto): Promise<SystemConfigResponseDto>;
    update(id: string, dto: UpdateSystemConfigDto): Promise<SystemConfigResponseDto>;
    remove(id: string): Promise<DeletedSystemConfigResponseDto>;
}
