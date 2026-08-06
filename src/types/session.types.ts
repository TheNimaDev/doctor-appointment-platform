import { Session } from '@/modules/session/entities';
import { NormalizedClientInfo } from './request.types';

export interface CreateSessionPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
}

export type FindUserSessionsOutput = Session[];
