import { User } from '@/modules/user/entities';
import { RolesAndPermissions } from './token.types';
import { EntityManager } from 'typeorm';
import { RegisterParams } from './auth.types';
import { UserStatus } from '@/modules/user/enums';

/** User type without sensitive fields. */
export type SafeUser = Omit<User, 'password' | 'sessions'>;

/** User data combined with roles and permissions. */
export type UserRolePermission = SafeUser & RolesAndPermissions;

/** User response payload. */
export interface UserResponse {
  user: UserRolePermission;
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
export interface UpdatePasswordParams {
  userId: string;
  password: string;
  manager?: EntityManager;
}

/** Parameters required to update a user's profile. */
export interface UpdateProfileParams {
  userId: string;
  firstName?: string;
  lastName?: string;
}

/** Parameters required to update a user's email address. */
export interface UpdateEmailParams {
  userId: string;
  email: string;
  manager?: EntityManager;
}

/** Parameters required to delete the current user's account. */
export interface DeleteUserParams {
  userId: string;
  password: string;
}
