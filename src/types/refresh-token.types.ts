import { RefreshToken } from '@/modules/refresh-token/entities';
import { NormalizedClientInfo } from './request.types';
import { EntityManager, FindOptionsWhere } from 'typeorm';

/** Refresh token data without the associated session. */
export type SafeRefreshToken = Omit<RefreshToken, 'session'>;

/** Payload required to create a refresh token. */
export interface CreateRefreshTokenPayload {
  sessionId: string;
  clientInfo: NormalizedClientInfo;
  remember: boolean;
  manager?: EntityManager;
}

/** Payload required to find an active refresh token by session. */
export interface FindActiveRefreshTokenPayload {
  sessionId: string;
  manager?: EntityManager;
}

/** Payload required to find a valid refresh token by token value. */
export interface FindValidRefreshTokenPayload {
  token: string;
  manager?: EntityManager;
}

/** Payload required to revoke a refresh token by its hash. */
export interface RevokeRefreshTokenHashPayload {
  tokenHash: string;
  manager?: EntityManager;
}

/** Payload required to revoke a refresh token by its raw token. */
export interface RevokeRefreshTokenPayload {
  token: string;
  manager?: EntityManager;
}

/** Payload required to revoke all refresh tokens belonging to a user. */
export interface RevokeUserRefreshTokensPayload {
  userId: string;
  manager?: EntityManager;
}

/** Payload required to revoke refresh tokens matching a condition. */
export interface RevokeRefreshTokenByConditionPayload {
  manager?: EntityManager;
  where: FindOptionsWhere<RefreshToken>;
}

/** Data returned after creating a refresh token. */
export interface CreateRefreshTokenOutput {
  token: string;
  maxAge: number;
}
