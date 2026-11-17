import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PermissionResponseDto } from '../roles/dto/role-response.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<PermissionResponseDto[]> {
    return this.prisma.permission.findMany({
      select: {
        id: true,
        code: true,
        module: true,
        action: true,
        description: true,
      },
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }
}
