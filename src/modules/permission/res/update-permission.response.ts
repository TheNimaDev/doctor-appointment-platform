import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PermissionResponse } from '@/types';
import { permissionResponseSchema } from './permission.response';

const path = 'permissions/:id';

/** Swagger response schema for successfully updating a permission. */
export class UpdatePermissionResponse extends getBaseOkResponseSchema<PermissionResponse>({
  path,
  response: {
    message: 'Permission updated successfully.',
    data: permissionResponseSchema,
  },
}) {}

/** Swagger response schema for invalid permission update data. */
export class UpdatePermissionBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'name', error: 'Name must be at least 2 characters.' },
    { field: 'module', error: 'Module must be at least 2 characters.' },
    { field: 'action', error: 'Action must be at least 2 characters.' },
    { field: 'description', error: 'Description must be at least 2 characters.' },
  ],
}) {}

/** Swagger response schema for a missing permission during update. */
export class UpdatePermissionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Permission not found in database.',
  error: 'Permission Not Found',
}) {}

/** Swagger response schema for a duplicate permission name during update. */
export class UpdatePermissionConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Permission already exists in database, please change name.',
  error: 'Permission already exists',
}) {}
