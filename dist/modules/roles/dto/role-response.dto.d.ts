export declare class RoleResponseDto {
    id: string;
    code: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PermissionResponseDto {
    id: string;
    code: string;
    module: string;
    action: string;
    description: string | null;
}
export declare class RoleDetailResponseDto extends RoleResponseDto {
    permissions: PermissionResponseDto[];
}
export declare class RolePermissionsResponseDto {
    permissions: PermissionResponseDto[];
}
export declare class DeletedRoleResponseDto {
    id: string;
}
