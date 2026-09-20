import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { UserRolesResponse } from '@/types';
import { userRolesResponseSchema } from './user-role.response';

const path = 'users/:userId/roles';

/** Swagger response schema for successfully retrieving a user's roles. */
export class FindUserRolesResponse extends getBaseOkResponseSchema<UserRolesResponse>({
  path,
  response: {
    message: 'User roles retrieved successfully.',
    data: userRolesResponseSchema,
  },
}) {}

/** Swagger response schema for a missing user. */
export class FindUserRolesNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'User not found in database.',
  error: 'User Not Found',
}) {}
