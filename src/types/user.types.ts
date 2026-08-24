import { User } from '@/modules/user/entities';
import { RolesAndPermissions } from './token.types';
import { EntityManager } from 'typeorm';
import { RegisterParams } from './auth.types';
import { UserStatus } from '@/modules/user/enums';
import { Role, RolePermission, UserRole } from '@/modules/role/entities';
import { Permission } from '@/modules/permission/entities';

/** User type without sensitive fields. */
export type SafeUser = Omit<User, 'password' | 'sessions' | 'doctor'>;

/** User data with roles and permissions exposed in API responses. */
export type UserRolePermission = Omit<SafeUser, 'userRoles'> & RolesAndPermissions;

/** User loaded with roles and permissions relations. */
export type UserRoleIncludeType = SafeUser & {
  userRoles: Array<
    UserRole & {
      role: Role & {
        rolePermissions: Array<
          RolePermission & {
            permission: Permission;
          }
        >;
      };
    }
  >;
};

/** User response payload. */
export interface UserResponse {
  user: UserRolePermission;
}

/** User data with password for internal authentication. */
export interface UserWithPasswordResponse {
  user: SafeUser & {
    password: string;
  };
}

/** Parameters for creating a new user. */
export interface CreateUserPayload extends RegisterParams {
  manager?: EntityManager;
}

/** Parameters for updating a user's status. */
export interface UpdateUserStatusPayload {
  userId: string;
  status: UserStatus;
  manager?: EntityManager;
}

/** Parameters for finding a user by id. */
export interface GetUserByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for finding a user by email. */
export interface FindUserByEmailPayload {
  email: string;
  manager?: EntityManager;
}

/** Parameters required to update a user's password. */
export interface UpdatePasswordPayload {
  userId: string;
  password: string;
  manager?: EntityManager;
}

/** Parameters required to update a user's profile. */
export interface UpdateProfilePayload {
  userId: string;
  firstName?: string;
  lastName?: string;
  manager?: EntityManager;
}

/** Parameters required to update a user's email address. */
export interface UpdateEmailPayload {
  userId: string;
  email: string;
  manager?: EntityManager;
}

/** Parameters required to delete the current user's account. */
export interface DeleteUserPayload {
  userId: string;
  password: string;
}
