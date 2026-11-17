import { UserStatus } from '../../generated/prisma/client';
export interface AuthenticatedUser {
    id: string;
    email: string;
    fullName: string;
    status: UserStatus;
    role: {
        id: string;
        code: string;
        name: string;
        isSystem: boolean;
        permissions: string[];
    };
}
export interface AuthUserRecord {
    id: string;
    email: string;
    fullName: string;
    status: UserStatus;
    deletedAt: Date | null;
    passwordHash: string;
    role: {
        id: string;
        code: string;
        name: string;
        isSystem: boolean;
        permissions: {
            permission: {
                code: string;
            };
        }[];
    };
}
export declare const authUserSelect: {
    readonly id: true;
    readonly email: true;
    readonly fullName: true;
    readonly status: true;
    readonly deletedAt: true;
    readonly passwordHash: true;
    readonly role: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly isSystem: true;
            readonly permissions: {
                readonly select: {
                    readonly permission: {
                        readonly select: {
                            readonly code: true;
                        };
                    };
                };
            };
        };
    };
};
export declare function mapAuthenticatedUser(user: AuthUserRecord): AuthenticatedUser;
