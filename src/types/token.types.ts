import { SafeRefreshToken } from './refresh-token.types';
import { SafeSession } from './session.types';
import { UserResponse } from './user.types';

/** Shared roles and permissions data used in token payloads. */
export interface RolesAndPermissions {
  roles: string[];
  permissions: string[];
}

/** JWT access token payload. */
export interface AccessTokenPayload extends RolesAndPermissions {
  sub: string;
  sessionId: string;
  iat?: number;
  exp?: number;
  display_name?: string;
}

/** Authenticated refresh token context. */
export interface RefreshTokenPayload extends UserResponse {
  refreshRecord: SafeRefreshToken;
  session: SafeSession;
}
