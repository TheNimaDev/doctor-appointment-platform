import { RefreshToken } from '@/modules/refresh-token/entities';
import { NormalizedClientInfo } from './request.types';

export type SafeRefreshToken = Omit<RefreshToken, 'session' | 'sessionId'>;

export interface CreateRefreshTokenPayload {
  sessionId: string;
  clientInfo: NormalizedClientInfo;
  remember: boolean;
}

export interface FindActiveRefreshTokenPayload {
  sessionId: string;
  clientInfo: NormalizedClientInfo;
}

export interface CreateRefreshTokenOutput {
  token: string;
  maxAge: number;
}
