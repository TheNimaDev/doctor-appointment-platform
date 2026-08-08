import { Session } from '@/modules/session/entities';
import { NormalizedClientInfo } from './request.types';
import { EntityManager } from 'typeorm';

/** Session data without associated user or refresh tokens. */
export type SafeSession = Omit<Session, 'user' | 'refreshTokens'>;

/** Payload required to create a session. */
export interface CreateSessionPayload {
  userId: string;
  remember: boolean;
  clientInfo: NormalizedClientInfo;
  manager?: EntityManager;
}

/** Payload required to find all sessions belonging to a user. */
export interface FindUserSessionsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Payload required to find an active session by user and client information. */
export interface FindActiveUserSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
  manager?: EntityManager;
}

/** Payload required to find an active session by id. */
export interface FindSessionByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** List of sessions belonging to a user. */
export type FindUserSessionsOutput = SafeSession[];

/** Payload required to update a session's activity and remember preference. */
export interface UpdateSessionPayload {
  sessionId: string;
  remember?: boolean;
  manager?: EntityManager;
}

/** Payload required to revoke an active session. */
export interface RevokeSessionPayload {
  sessionId: string;
  manager?: EntityManager;
}

/** Payload required to revoke all active sessions belonging to a user. */
export interface RevokeUserSessionsPayload {
  userId: string;
  manager?: EntityManager;
}
