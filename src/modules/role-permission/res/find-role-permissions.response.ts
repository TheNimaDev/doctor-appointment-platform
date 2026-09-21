import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { RolePermissionsResponse } from '@/types';
import { rolePermissionsResponseSchema } from './role-permission.response';

const path = 'roles/:roleId/permissions';

/** Swagger response schema for successfully retrieving a role's permissions. */
export class FindRolePermissionsResponse extends getBaseOkResponseSchema<RolePermissionsResponse>({
  path,
  response: {
    message: 'Role permissions retrieved successfully.',
    data: rolePermissionsResponseSchema,
  },
}) {}

/** Swagger response schema for a missing role. */
export class FindRolePermissionsNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role not found in database.',
  error: 'Role Not Found',
}) {}
