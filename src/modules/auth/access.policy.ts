import { ForbiddenException } from '@nestjs/common';
import { MESSAGES } from '../../common/constants/messages';
import { SUPER_ADMIN_ROLE_CODE } from '../../common/constants/system';
import { AuthenticatedUser } from './authenticated-user';

export function assertCanGrant(
  actor: AuthenticatedUser,
  permissionCodes: string[],
): void {
  const missing = permissionCodes.some(
    (code) => !actor.role.permissions.includes(code),
  );
  if (missing) {
    throw new ForbiddenException(MESSAGES.PRIVILEGE_ESCALATION);
  }
}

export function assertCanAssignRole(
  actor: AuthenticatedUser,
  roleCode: string,
  permissionCodes: string[],
): void {
  if (
    roleCode === SUPER_ADMIN_ROLE_CODE &&
    actor.role.code !== SUPER_ADMIN_ROLE_CODE
  ) {
    throw new ForbiddenException(MESSAGES.SUPER_ADMIN_PROTECTED);
  }
  assertCanGrant(actor, permissionCodes);
}

export function assertCanTouchSuperAdmin(
  actor: AuthenticatedUser,
  targetRoleCode: string,
): void {
  if (
    targetRoleCode === SUPER_ADMIN_ROLE_CODE &&
    actor.role.code !== SUPER_ADMIN_ROLE_CODE
  ) {
    throw new ForbiddenException(MESSAGES.SUPER_ADMIN_PROTECTED);
  }
}
