import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { RoleResponse } from '@/types';
import { roleResponseSchema } from './role.response';

const path = 'roles/:id';

/** Swagger response schema for successfully retrieving a role. */
export class FindRoleResponse extends getBaseOkResponseSchema<RoleResponse>({
  path,
  response: {
    message: 'Role retrieved successfully.',
    data: roleResponseSchema,
  },
}) {}

/** Swagger response schema for a missing role. */
export class FindRoleNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role not found in database.',
  error: 'Role Not Found',
}) {}
