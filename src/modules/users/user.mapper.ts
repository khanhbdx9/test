import { UserStatus } from '../../generated/prisma/client';
import { UserResponseDto } from './dto/user-response.dto';

export const publicUserSelect = {
  id: true,
  email: true,
  fullName: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      code: true,
      name: true,
    },
  },
} as const;

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

export function mapUserResponse(user: PublicUserRecord): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    role: {
      id: user.role.id,
      code: user.role.code,
      name: user.role.name,
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
