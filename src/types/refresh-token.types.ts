import { RefreshToken } from '@/modules/refresh-token/entities';
import { NormalizedClientInfo } from './request.types';
import { EntityManager, FindOptionsWhere } from 'typeorm';

export type SafeRefreshToken = Omit<RefreshToken, 'session'>;

export interface CreateRefreshTokenPayload {
  sessionId: string;
  clientInfo: NormalizedClientInfo;
  remember: boolean;
  manager?: EntityManager;
}

export interface FindActiveRefreshTokenPayload {
  sessionId: string;
  manager?: EntityManager;
}

export interface FindValidRefreshTokenPayload {
  token: string;
  manager?: EntityManager;
}

export interface RevokeRefreshTokenHashPayload {
  tokenHash: string;
  manager?: EntityManager;
}

export interface RevokeRefreshTokenPayload {
  token: string;
  manager?: EntityManager;
}

export interface RevokeAllUserRefreshTokensPayload {
  userId: string;
  manager?: EntityManager;
}

export interface RevokeRefreshTokenByConditionPayload {
  manager?: EntityManager;
  where: FindOptionsWhere<RefreshToken>;
}

export interface CreateRefreshTokenOutput {
  token: string;
  maxAge: number;
}
