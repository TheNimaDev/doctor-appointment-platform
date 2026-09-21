import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { RolePermissionResponse } from '@/types';
import { rolePermissionResponseSchema } from './role-permission.response';

const path = 'roles/:roleId/permissions';

/** Swagger response schema for successfully assigning a permission to a role. */
export class AddRolePermissionResponse extends getBaseOkResponseSchema<RolePermissionResponse>({
  path,
  create: true,
  response: {
    message: 'Permission assigned to role successfully.',
    data: rolePermissionResponseSchema,
  },
}) {}

/** Swagger response schema for invalid role-permission assignment data. */
export class AddRolePermissionBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'permissionId',
      error: 'Permission ID must be a valid UUID.',
    },
  ],
}) {}

/** Swagger response schema for a missing role or permission. */
export class AddRolePermissionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role not found in database.',
  error: 'Role Not Found',
}) {}

/** Swagger response schema for an already assigned permission. */
export class AddRolePermissionConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'This permission is already assigned to the role.',
  error: 'Role Permission Already Exists',
}) {}
