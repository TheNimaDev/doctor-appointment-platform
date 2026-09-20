import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'users/:userId/roles/:roleId';

/** Swagger response schema for successfully removing a role from a user. */
export class RemoveUserRoleResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Role removed from user successfully.',
  },
}) {}

/** Swagger response schema for a missing user, role, or user-role relation. */
export class RemoveUserRoleNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'User role relation not found in database.',
  error: 'User Role Not Found',
}) {}
