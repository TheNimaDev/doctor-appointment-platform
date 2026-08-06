import { RefreshToken } from '@/modules/refresh-token/entities';
import { NormalizedClientInfo } from './request.types';

export type SafeRefreshToken = Omit<RefreshToken, 'user' | 'userId'>;

export interface CreateRefreshTokenPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
  remember: boolean;
}

export interface FindActiveRefreshTokenPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
}

export interface CreateRefreshTokenOutput {
  token: string;
  maxAge: number;
}
