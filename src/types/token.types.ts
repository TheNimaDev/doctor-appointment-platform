import { SafeRefreshToken } from './refresh-token.types';
import { UserResponse } from './user.types';

/** Base token types */
export interface RolesAndPermissions {
  roles: string[];
  permissions: string[];
}

/** JWT access token payload */
export interface AccessTokenPayload extends RolesAndPermissions {
  sub: string;
  iat?: number;
  exp?: number;
  display_name?: string;
}

/** JWT refresh token payload */
export interface RefreshTokenPayload extends UserResponse {
  refreshRecord: SafeRefreshToken;
}
