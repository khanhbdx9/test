import { UserStatus } from '../../../generated/prisma/client';
export declare class UserRoleDto {
    id: string;
    code: string;
    name: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    fullName: string;
    status: UserStatus;
    role: UserRoleDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DeletedUserResponseDto {
    id: string;
}
