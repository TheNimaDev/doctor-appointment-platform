import { Session } from '@/modules/session/entities';
import { NormalizedClientInfo } from './request.types';
import { EntityManager } from 'typeorm';

export type SafeSession = Omit<Session, 'user' | 'refreshTokens'>;

export interface CreateSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
  manager?: EntityManager;
}

export interface FindUserSessionsPayload {
  userId: string;
  manager?: EntityManager;
}

export interface FindActiveUserSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
  manager?: EntityManager;
}

export interface FindSessionByIdPayload {
  id: string;
  manager?: EntityManager;
}

export type FindUserSessionsOutput = SafeSession[];

export interface UpdateLastActiveSessionPayload {
  sessionId: string;
  manager?: EntityManager;
}

export interface RevokeSessionPayload {
  sessionId: string;
  manager?: EntityManager;
}

export interface RevokeUserSessionsPayload {
  userId: string;
  manager?: EntityManager;
}
