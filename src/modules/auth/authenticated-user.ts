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
    permissions: { permission: { code: string } }[];
  };
}

export const authUserSelect = {
  id: true,
  email: true,
  fullName: true,
  status: true,
  deletedAt: true,
  passwordHash: true,
  role: {
    select: {
      id: true,
      code: true,
      name: true,
      isSystem: true,
      permissions: {
        select: {
          permission: {
            select: { code: true },
          },
        },
      },
    },
  },
} as const;

export function mapAuthenticatedUser(user: AuthUserRecord): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    role: {
      id: user.role.id,
      code: user.role.code,
      name: user.role.name,
      isSystem: user.role.isSystem,
      permissions: user.role.permissions.map((item) => item.permission.code),
    },
  };
}
