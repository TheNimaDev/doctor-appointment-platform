import { User } from '@/modules/user/entities';
import { SafeUser } from './user.types';

/** Auth response user payload */
export interface AuthUserResponse {
  user: SafeUser;
}

/** Login response payload */
export interface LoginResponse extends AuthUserResponse {
  accessToken: string;
}
