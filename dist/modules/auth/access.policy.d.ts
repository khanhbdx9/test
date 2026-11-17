import { AuthenticatedUser } from './authenticated-user';
export declare function assertCanGrant(actor: AuthenticatedUser, permissionCodes: string[]): void;
export declare function assertCanAssignRole(actor: AuthenticatedUser, roleCode: string, permissionCodes: string[]): void;
export declare function assertCanTouchSuperAdmin(actor: AuthenticatedUser, targetRoleCode: string): void;
