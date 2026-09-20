import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';

const path = 'auth/password/change';

/** Swagger response schema for successfully changing the password. */
export class ChangePasswordResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Password changed successfully.',
  },
}) {}

/** Swagger response schema for invalid current password. */
export class ChangePasswordUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Invalid current password.',
  error: 'Invalid Credentials',
  path,
  statusCode: 401,
}) {}

/** Swagger response schema for invalid password change request data. */
export class ChangePasswordBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'currentPassword',
      error: 'Current password must be at least 8 characters.',
    },
    {
      field: 'newPassword',
      error: 'New password must be at least 8 characters.',
    },
  ],
}) {}
