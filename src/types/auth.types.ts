import { CreateRefreshTokenOutput } from './refresh-token.types';
import { NormalizedClientInfo } from './request.types';
import { UserResponse } from './user.types';

/** Response returned after a successful login. */
export interface LoginResponse extends UserResponse {
  accessToken: string;
}

/** Parameters required to register a new user. */
export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Parameters required to authenticate a user. */
export interface LoginParams {
  email: string;
  password: string;
  remember?: boolean;
  clientInfo: NormalizedClientInfo;
}

/** Result returned by the login service. */
export interface LoginServiceOutput extends LoginResponse {
  refreshToken: CreateRefreshTokenOutput;
}
