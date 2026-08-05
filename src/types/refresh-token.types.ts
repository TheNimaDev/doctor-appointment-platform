import { NormalizedClientInfo } from './request.types';

export interface CreateRefreshTokenPayload {
  userId: string;
  clientInfo: NormalizedClientInfo;
  remember: boolean;
}
