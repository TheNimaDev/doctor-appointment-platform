import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'roles/:roleId/permissions/:permissionId';

/** Swagger response schema for successfully removing a permission from a role. */
export class RemoveRolePermissionResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Permission removed from role successfully.',
  },
}) {}

/** Swagger response schema for a missing role or role-permission relation. */
export class RemoveRolePermissionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role permission relation not found in database.',
  error: 'Role Permission Not Found',
}) {}
