import { Session } from '@/modules/session/entities';
import { NormalizedClientInfo } from './request.types';
import { EntityManager } from 'typeorm';

/** Session type without sensitive relation data. */
export type SafeSession = Omit<Session, 'user' | 'refreshTokens'>;

/** Session API response. */
export interface SessionResponse {
  session: SafeSession;
}

/** Multiple sessions API response. */
export interface SessionsResponse {
  sessions: SafeSession[];
}

/** Parameters for creating a new session. */
export interface CreateSessionPayload {
  userId: string;
  remember: boolean;
  clientInfo: NormalizedClientInfo;
  manager?: EntityManager;
}

/** Parameters for finding all sessions belonging to a user. */
export interface FindUserSessionsPayload {
  userId: string;
  manager?: EntityManager;
}

/** Parameters for finding an active session by user and client information. */
export interface FindActiveUserSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
  manager?: EntityManager;
}

/** Parameters for finding an active session by ID. */
export interface FindSessionByIdPayload {
  id: string;
  manager?: EntityManager;
}

/** Parameters for updating a session. */
export interface UpdateSessionPayload {
  sessionId: string;
  remember?: boolean;
  manager?: EntityManager;
}

/** Parameters for revoking an active session. */
export interface RevokeSessionPayload {
  sessionId: string;
  manager?: EntityManager;
}

/** Parameters for revoking all active sessions belonging to a user. */
export interface RevokeUserSessionsPayload {
  userId: string;
  manager?: EntityManager;
}
