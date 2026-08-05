import { User } from '@/modules/user/entities';
import { RolesAndPermissions } from './token.types';

/** User type without sensitive fields */
export type SafeUser = Omit<User, 'password' | 'refreshTokens'>;

/** User with roles and permissions */
export type UserRolePermission = SafeUser & RolesAndPermissions;

/** User response payload */
export interface UserResponse {
  user: UserRolePermission;
}
