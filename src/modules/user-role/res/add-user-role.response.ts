import {
  getBaseOkResponseSchema,
  getNormalErrorResponse,
  getValidationErrorResponse,
} from '@/common/swagger';
import type { UserRoleResponse } from '@/types';
import { userRoleResponseSchema } from './user-role.response';

const path = 'users/:userId/roles';

/** Swagger response schema for successfully assigning a role to a user. */
export class AddUserRoleResponse extends getBaseOkResponseSchema<UserRoleResponse>({
  path,
  create: true,
  response: {
    message: 'Role assigned to user successfully.',
    data: userRoleResponseSchema,
  },
}) {}

/** Swagger response schema for invalid role assignment data. */
export class AddUserRoleBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'roleId',
      error: 'Role ID must be a valid UUID.',
    },
  ],
}) {}

/** Swagger response schema for a missing user or role. */
export class AddUserRoleNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role not found in database.',
  error: 'Role Not Found',
}) {}

/** Swagger response schema for an already assigned role. */
export class AddUserRoleConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'This role is already assigned to the user.',
  error: 'User Role Already Exists',
}) {}
