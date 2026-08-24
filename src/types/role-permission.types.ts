import { EntityManager } from 'typeorm';
import { RolePermission } from '@/modules/role-permission/entities';

/** Role-Permission relation without relation data. */
export type SafeRolePermission = Omit<RolePermission, 'role' | 'permission'>;

/** Multiple role-permission API response. */
export interface RolePermissionsResponse {
  rolePermissions: SafeRolePermission[];
}

/** Single role-permission API response. */
export interface RolePermissionResponse {
  rolePermission: SafeRolePermission;
}

/** Parameters for adding a permission to a role. */
export interface AddRolePermissionPayload {
  roleId: string;
  permissionId: string;
  manager?: EntityManager;
}

/** Parameters for finding a role-permission relation. */
export interface FindRolePermissionPayload {
  roleId: string;
  permissionId: string;
  manager?: EntityManager;
}

/** Parameters for removing a permission from a role. */
export interface RemoveRolePermissionPayload {
  roleId: string;
  permissionId: string;
  manager?: EntityManager;
}

/** Parameters for finding all permissions assigned to a role. */
export interface FindRolePermissionsPayload {
  roleId: string;
  manager?: EntityManager;
}
