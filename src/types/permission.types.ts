import { EntityManager } from 'typeorm';

import { Permission } from '@/modules/permission/entities';

/** Permission without relation data. */
export type SafePermission = Omit<Permission, 'rolePermissions'>;

/** Single permission API response. */
export interface PermissionResponse {
  permission: SafePermission;
}

/** Multiple permissions API response. */
export interface PermissionsResponse {
  permissions: SafePermission[];
}

/** Parameters for creating a permission. */
export interface CreatePermissionPayload {
  name: string;
  module: string;
  action: string;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for updating a permission. */
export interface UpdatePermissionPayload {
  id: string;
  name?: string;
  module?: string;
  action?: string;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for finding a permission by ID. */
export interface FindPermissionByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a permission by name. */
export interface FindPermissionByNamePayload {
  name: string;
  manager?: EntityManager;
}

/** Parameters for finding all permissions. */
export interface FindPermissionsPayload {
  manager?: EntityManager;
}

/** Parameters for deleting a permission. */
export interface DeletePermissionPayload {
  id: string;
  manager?: EntityManager;
}
