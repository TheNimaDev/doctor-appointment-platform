import { getBaseOkResponseSchema } from '@/common/swagger';
import type { UserResponse } from '@/types';
import { userResponseSchema } from './user.response';

const path = 'users/me';

/** Swagger response schema for successfully retrieving the current user's profile. */
export class GetMeResponse extends getBaseOkResponseSchema<UserResponse>({
  path,
  response: {
    message: 'User retrieved successfully.',
    data: userResponseSchema,
  },
}) {}
