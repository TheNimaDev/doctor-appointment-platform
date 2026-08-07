import { Session } from '@/modules/session/entities';
import { NormalizedClientInfo } from './request.types';

export type SafeSession = Omit<Session, 'user' | 'refreshTokens'>;

export interface CreateSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
}

export type FindUserSessionsOutput = SafeSession[];

export interface FindActiveUserSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
}
