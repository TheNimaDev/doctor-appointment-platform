import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'auth/password/reset';

/** Swagger response schema for successfully resetting the password. */
export class ResetPasswordResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Password reset successfully.',
  },
}) {}

/** Swagger response schema for an invalid or expired password reset token. */
export class ResetPasswordBadRequestResponse extends getNormalErrorResponse({
  message: 'Invalid or expired password reset token.',
  error: 'Invalid Token',
  path,
  statusCode: 400,
}) {}
