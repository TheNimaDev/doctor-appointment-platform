import { EntityManager } from 'typeorm';

import { Role } from '@/modules/role/entities';

/** Role type without sensitive relation data. */
export type SafeRole = Omit<Role, 'rolePermissions' | 'userRoles'>;

/** Role API response. */
export interface RoleResponse {
  role: SafeRole;
}

/** Multiple roles API response. */
export interface RolesResponse {
  roles: SafeRole[];
}

/** Parameters for creating a new role. */
export interface CreateRolePayload {
  name: string;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for updating a role. */
export interface UpdateRolePayload {
  id: string;
  name?: string;
  description?: string | null;
  manager?: EntityManager;
}

/** Parameters for finding a role by ID. */
export interface FindRoleByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a role by name. */
export interface FindRoleByNamePayload {
  name: string;
  manager?: EntityManager;
}

/** Parameters for finding all roles. */
export interface FindRolesPayload {
  manager?: EntityManager;
}

/** Parameters for deleting a role. */
export interface DeleteRolePayload {
  id: string;
  manager?: EntityManager;
}
