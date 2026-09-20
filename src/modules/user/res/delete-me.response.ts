import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';

const path = 'users/me';

/** Swagger response schema for successfully deleting the current user's account. */
export class DeleteMeResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Account deleted successfully.',
  },
}) {}

/** Swagger response schema for invalid account deletion request data. */
export class DeleteMeBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'password',
      error: 'Password must be at least 8 characters.',
    },
  ],
}) {}

/** Swagger response schema for an incorrect current password. */
export class DeleteMeUnauthorizedResponse extends getNormalErrorResponse({
  message: 'Current password is incorrect.',
  error: 'Invalid Current Password',
  path,
  statusCode: 401,
}) {}
