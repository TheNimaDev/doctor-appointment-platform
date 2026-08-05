import { CreateRefreshTokenOutput } from './refresh-token.types';
import { NormalizedClientInfo } from './request.types';
import { UserResponse } from './user.types';

/** Login response payload */
export interface LoginResponse extends UserResponse {
  accessToken: string;
}

/** Register service parameters */
export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Login service parameters */
export interface LoginParams {
  email: string;
  password: string;
  remember?: boolean;
  clientInfo: NormalizedClientInfo;
}


export interface LoginServiceOutput extends LoginResponse {
  refreshToken: CreateRefreshTokenOutput;
}