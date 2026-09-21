import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PermissionResponse } from '@/types';
import { permissionResponseSchema } from './permission.response';

const path = 'permissions';

/** Swagger response schema for successfully creating a permission. */
export class CreatePermissionResponse extends getBaseOkResponseSchema<PermissionResponse>({
  path,
  create: true,
  response: {
    message: 'Permission created successfully.',
    data: permissionResponseSchema,
  },
}) {}

/** Swagger response schema for invalid permission creation data. */
export class CreatePermissionBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'name', error: 'Name must be at least 2 characters.' },
    { field: 'module', error: 'Module must be at least 2 characters.' },
    { field: 'action', error: 'Action must be at least 2 characters.' },
    { field: 'description', error: 'Description must be at least 2 characters.' },
  ],
}) {}

/** Swagger response schema for a duplicate permission name. */
export class CreatePermissionConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Permission already exists in database, please change name.',
  error: 'Permission already exists',
}) {}
