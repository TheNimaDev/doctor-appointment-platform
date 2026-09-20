import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';

const path = 'auth/verify/email/resend';

/** Swagger response schema for successfully resending the verification email. */
export class VerifyEmailResendResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Verification email sent successfully.',
  },
}) {}

/** Swagger response schema for invalid login credentials. */
export class VerifyEmailResendUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Invalid user credentials.',
  error: 'Invalid Credentials',
  path,
  statusCode: 401,
}) {}

/** Swagger response schema for invalid resend request data. */
export class VerifyEmailResendBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'email',
      error: 'Invalid email address.',
    },
    {
      field: 'password',
      error: 'Password must be at least 8 characters.',
    },
  ],
}) {}
