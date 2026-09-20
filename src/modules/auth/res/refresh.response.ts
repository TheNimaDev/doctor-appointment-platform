import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { LoginResponse } from '@/types';
import { loginResponseSchema } from './login.response';

const path = 'auth/refresh';

/** Swagger response schema for successfully refreshing the access token. */
export class RefreshResponse extends getBaseOkResponseSchema<LoginResponse>({
  path,
  response: {
    message: 'Token refreshed successfully.',
    data: loginResponseSchema,
  },
}) {}

/** Swagger response schema for an invalid or unavailable refresh token. */
export class RefreshUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Invalid or expired refresh token.',
  error: 'Invalid Refresh Token',
  path,
  statusCode: 401,
}) {}
