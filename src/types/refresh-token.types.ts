import { RefreshToken } from '@/modules/refresh-token/entities';
import { NormalizedClientInfo } from './request.types';
import { EntityManager, FindOptionsWhere } from 'typeorm';

/** Refresh token without relation data. */
export type SafeRefreshToken = Omit<RefreshToken, 'session'>;

/** Payload for creating a refresh token. */
export interface CreateRefreshTokenPayload {
  sessionId: string;
  clientInfo: NormalizedClientInfo;
  remember: boolean;
  manager?: EntityManager;
}

/** Payload for finding an active refresh token by session. */
export interface FindActiveRefreshTokenPayload {
  sessionId: string;
  manager?: EntityManager;
}

/** Payload for finding a valid refresh token by token. */
export interface FindValidRefreshTokenPayload {
  token: string;
  manager?: EntityManager;
}

/** Payload for revoking a refresh token by hash. */
export interface RevokeRefreshTokenHashPayload {
  tokenHash: string;
  manager?: EntityManager;
}

/** Payload for revoking a refresh token by token. */
export interface RevokeRefreshTokenPayload {
  token: string;
  manager?: EntityManager;
}

/** Payload for revoking all refresh tokens belonging to a user. */
export interface RevokeUserRefreshTokensPayload {
  userId: string;
  manager?: EntityManager;
}

/** Payload for revoking a refresh token by condition. */
export interface RevokeRefreshTokenByConditionPayload {
  manager?: EntityManager;
  where: FindOptionsWhere<RefreshToken>;
}

/** Response containing a newly created refresh token. */
export interface CreateRefreshTokenResponse {
  token: string;
  maxAge: number;
}
