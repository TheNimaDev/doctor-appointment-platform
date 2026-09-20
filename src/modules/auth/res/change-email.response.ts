import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';

const path = 'auth/email/change';

/** Swagger response schema for successfully requesting an email change. */
export class ChangeEmailResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'A verification email has been sent to your current email address.',
  },
}) {}

/** Swagger response schema for an incorrect current password. */
export class ChangeEmailUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Current password is incorrect.',
  error: 'Invalid Current Password',
  path,
  statusCode: 401,
}) {}

/** Swagger response schema for invalid email change request data. */
export class ChangeEmailBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'password',
      error: 'Password must be at least 8 characters.',
    },
  ],
}) {}
