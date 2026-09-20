import { getBaseOkResponseSchema, getValidationErrorResponse } from '@/common/swagger';

const path = 'auth/password/forgot';

/** Swagger response schema for a successful password reset request. */
export class ForgotPasswordResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'If the email exists, a password reset link has been sent.',
  },
}) {}

/** Swagger response schema for invalid password reset request data. */
export class ForgotPasswordBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'email',
      error: 'Invalid email address.',
    },
  ],
}) {}
