import { User } from '@/modules/user/entities';
import { RolesAndPermissions } from './token.types';
import { EntityManager } from 'typeorm';
import { RegisterParams } from './auth.types';
import { UserStatus } from '@/modules/user/enums';

/** User type without sensitive fields */
export type SafeUser = Omit<User, 'password' | 'sessions'>;

/** User with roles and permissions */
export type UserRolePermission = SafeUser & RolesAndPermissions;

/** User response payload */
export interface UserResponse {
  user: UserRolePermission;
}

export interface CreateUserPayload extends RegisterParams {
  manager?: EntityManager;
}

export interface UpdateUserStatusPayload {
  userId: string;
  status: UserStatus;
  manager?: EntityManager;
}

export interface GetUserByIdPayload {
  id: string;
  manager?: EntityManager;
}

export interface FindUserByEmailPayload {
  email: string;
  manager?: EntityManager;
}
