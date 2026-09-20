import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'roles/:id';

/** Swagger response schema for successfully deleting a role. */
export class DeleteRoleResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Role deleted successfully.',
  },
}) {}

/** Swagger response schema for a missing role during deletion. */
export class DeleteRoleNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role not found in database.',
  error: 'Role Not Found',
}) {}

/** Swagger response schema for a role referenced by other resources. */
export class DeleteRoleConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Role cannot be deleted because it is used by other resources',
  error: 'Role is referenced',
}) {}
