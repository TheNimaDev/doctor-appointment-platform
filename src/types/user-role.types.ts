import { EntityManager } from 'typeorm';
import { UserRole } from '@/modules/user-role/entities';

/** User-Role relation without relation data. */
export type SafeUserRole = Omit<UserRole, 'user' | 'role'>;

/** Single user-role API response. */
export interface UserRoleResponse {
  userRole: SafeUserRole;
}

/** Multiple user-role API response. */
export interface UserRolesResponse {
  userRoles: SafeUserRole[];
}

/** Parameters for adding a role to a user. */
export interface AddUserRolePayload {
  userId: string;
  roleId: string;
  manager?: EntityManager;
}

/** Parameters for finding a user-role relation. */
export interface FindUserRolePayload {
  userId: string;
  roleId: string;
  manager?: EntityManager;
}

/** Parameters for finding all roles assigned to a user. */
export interface FindUserRolesPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters for removing a role from a user. */
export interface RemoveUserRolePayload {
  userId: string;
  roleId: string;
  manager?: EntityManager;
}
