import { UserStatus } from '../../generated/prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
export declare const publicUserSelect: {
    readonly id: true;
    readonly email: true;
    readonly fullName: true;
    readonly status: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly role: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
};
export interface PublicUserRecord {
    id: string;
    email: string;
    fullName: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
    role: {
        id: string;
        code: string;
        name: string;
    };
}
export declare function mapUserResponse(user: PublicUserRecord): UserResponseDto;
