import { User } from '@/modules/user/entities';
import { SafeUser } from './user.types';

/** User data required for authentication */
export type AuthUser = Pick<User, 'id' | 'email' | 'password' | 'status'>;

/** Auth response user payload */
export interface AuthUserResponse {
  user: SafeUser;
}

/** Login response payload */
export interface LoginResponse extends AuthUserResponse {
  accessToken: string;
}
