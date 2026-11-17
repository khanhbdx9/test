import { UserStatus } from '../../../generated/prisma/client';
export declare class AuthRoleDto {
    id: string;
    code: string;
    name: string;
}
export declare class MeResponseDto {
    id: string;
    email: string;
    fullName: string;
    status: UserStatus;
    role: AuthRoleDto;
    permissions: string[];
}
export declare class TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}
export declare class LoginResponseDto extends TokenResponseDto {
    user: MeResponseDto;
}
export declare class LogoutResponseDto {
    revoked: boolean;
}
