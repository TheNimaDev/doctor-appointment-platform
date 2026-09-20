import { getBaseOkResponseSchema, getValidationErrorResponse, getNormalErrorResponse } from '@/common/swagger';

const path = 'auth/verify/email';

/** Swagger response schema for successful email verification. */
export class VerifyEmailResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Email verified successfully.',
  },
}) {}

/** Swagger response schema for invalid email verification request data. */
export class VerifyEmailValidationErrorResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'token',
      error: 'Token must be a string.',
    },
  ],
}) {}

/** Swagger response schema for an invalid or expired email verification token. */
export class VerifyEmailBadRequestResponse extends getNormalErrorResponse({
  message: 'Invalid or expired email token.',
  error: 'Invalid Token',
  path,
  statusCode: 400,
}) {}
