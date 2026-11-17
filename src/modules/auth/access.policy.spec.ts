import { ForbiddenException } from '@nestjs/common';
import { UserStatus } from '../../generated/prisma/client';
import { MESSAGES } from '../../common/constants/messages';
import { SUPER_ADMIN_ROLE_CODE } from '../../common/constants/system';
import { AuthenticatedUser } from './authenticated-user';
import { assertCanAssignRole, assertCanGrant } from './access.policy';

function actor(permissions: string[], code = 'ADMIN'): AuthenticatedUser {
  return {
    id: '7d5c8c3e-3d4e-4f1a-9c1b-6a2d9e0f1234',
    email: 'admin@minhsam.local',
    fullName: 'Admin',
    status: UserStatus.ACTIVE,
    role: {
      id: '6c4b7b2d-2c3d-4e09-8b0a-5f1c8d9e0123',
      code,
      name: 'Admin',
      isSystem: true,
      permissions,
    },
  };
}

describe('access policy', () => {
  it('cho phép gán quyền đang có', () => {
    expect(() => assertCanGrant(actor(['roles.update', 'roles.view']), ['roles.view'])).not.toThrow();
  });

  it('từ chối tự nâng quyền', () => {
    expect(() => assertCanGrant(actor(['roles.view']), ['users.delete'])).toThrow(
      new ForbiddenException(MESSAGES.PRIVILEGE_ESCALATION),
    );
  });

  it('từ chối gán role SUPER_ADMIN khi không phải SUPER_ADMIN', () => {
    expect(() =>
      assertCanAssignRole(actor(['users.create'], 'ADMIN'), SUPER_ADMIN_ROLE_CODE, []),
    ).toThrow(new ForbiddenException(MESSAGES.SUPER_ADMIN_PROTECTED));
  });
});
