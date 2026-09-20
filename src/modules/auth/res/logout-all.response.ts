import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'auth/logout/all';

/** Swagger response schema for successfully logging out from all sessions. */
export class LogoutAllResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Logout from all devices successfully.',
  },
}) {}

/** Swagger response schema for an invalid or expired refresh token. */
export class LogoutAllUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Invalid or expired refresh token.',
  error: 'Invalid Refresh Token',
  path,
  statusCode: 401,
}) {}

/** Swagger response schema for a missing active session. */
export class LogoutAllNotFoundResponse extends getNormalErrorResponse({
  message: 'Active session not found in database.',
  error: 'Session Not Found',
  path,
  statusCode: 404,
}) {}
