import { SafeUser } from './user.types';

/** Auth response user payload */
export interface AuthUserResponse {
  user: SafeUser;
}

/** Login response payload */
export interface LoginResponse extends AuthUserResponse {
  accessToken: string;
}

/** User registration service parameters */
export type RegisterParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};