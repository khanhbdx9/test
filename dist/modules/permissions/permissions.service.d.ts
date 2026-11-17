import { PrismaService } from '../../database/prisma/prisma.service';
import { PermissionResponseDto } from '../roles/dto/role-response.dto';
export declare class PermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<PermissionResponseDto[]>;
}
