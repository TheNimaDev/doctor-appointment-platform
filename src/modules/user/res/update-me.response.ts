import { getBaseOkResponseSchema, getValidationErrorResponse } from '@/common/swagger';
import type { UserResponse } from '@/types';
import { userResponseSchema } from './user.response';

const path = 'users/me';

/** Swagger response schema for successfully updating the current user's profile. */
export class UpdateMeResponse extends getBaseOkResponseSchema<UserResponse>({
  path,
  response: {
    message: 'Profile updated successfully.',
    data: userResponseSchema,
  },
}) {}

/** Swagger response schema for invalid profile update request data. */
export class UpdateMeBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'firstName',
      error: 'First name must be at least 2 characters.',
    },
    {
      field: 'lastName',
      error: 'Last name must be at least 2 characters.',
    },
  ],
}) {}
