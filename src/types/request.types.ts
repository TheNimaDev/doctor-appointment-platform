import { Request } from 'express';
import { AccessTokenPayload, RefreshTokenPayload } from './token.types';

/** Authenticated user data extracted from access token */
export type UserAccess = Omit<AccessTokenPayload, 'sub'> & { userId: string };

/** HTTP request with authenticated user information */
export interface AccessRequest extends Request {
  user: UserAccess;
}

export interface RefreshRequest extends Request {
  refreshPayload: RefreshTokenPayload;
}

export interface NormalizedClientInfo {
  ipAddress: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  device: string;
  country: string | null;
  city: string | null;
}
