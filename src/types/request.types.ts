import { Request } from 'express';
import { AccessTokenPayload, RefreshTokenPayload } from './token.types';
import type { ObjectLiteral } from 'typeorm';
import { SafeClinic } from './clinic.types';
import { SafeDoctor } from './doctor.types';
import { SafePatient } from './patient.types';

/** Authenticated user data extracted from the access token. */
export type UserAccess = Omit<AccessTokenPayload, 'sub'> & {
  userId: string;
};

/** HTTP request containing authenticated user information. */
export interface AccessRequest extends Request {
  user: UserAccess;

  clinic?: SafeClinic;
  doctor?: SafeDoctor;
  patient?: SafePatient;
}

/** HTTP request containing the authenticated user and ownership data. */
export interface OwnershipRequest<T extends ObjectLiteral = ObjectLiteral> extends AccessRequest {
  ownershipData: T;
}

/** HTTP request containing authenticated refresh token information. */
export interface RefreshRequest extends Request {
  refreshPayload: RefreshTokenPayload;
}

/** Normalized client information extracted from the incoming request. */
export interface NormalizedClientInfo {
  ipAddress: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  device: string;
  country: string | null;
  city: string | null;
}
