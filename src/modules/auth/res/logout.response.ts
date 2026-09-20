import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'auth/logout';

/** Swagger response schema for successful logout. */
export class LogoutResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Logout successfully.',
  },
}) {}

/** Swagger response schema for an invalid or expired refresh token. */
export class LogoutUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Invalid or expired refresh token.',
  error: 'Invalid Refresh Token',
  path,
  statusCode: 401,
}) {}

/** Swagger response schema for a missing active session. */
export class LogoutNotFoundResponse extends getNormalErrorResponse({
  message: 'Active session not found in database.',
  error: 'Session Not Found',
  path,
  statusCode: 404,
}) {}
