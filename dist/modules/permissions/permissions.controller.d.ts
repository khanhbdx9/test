import { PermissionResponseDto } from '../roles/dto/role-response.dto';
import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): Promise<PermissionResponseDto[]>;
}
