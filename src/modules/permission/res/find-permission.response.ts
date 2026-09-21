import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PermissionResponse } from '@/types';
import { permissionResponseSchema } from './permission.response';

const path = 'permissions/:id';

/** Swagger response schema for successfully retrieving a permission. */
export class FindPermissionResponse extends getBaseOkResponseSchema<PermissionResponse>({
  path,
  response: {
    message: 'Permission retrieved successfully.',
    data: permissionResponseSchema,
  },
}) {}

/** Swagger response schema for a missing permission. */
export class FindPermissionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Permission not found in database.',
  error: 'Permission Not Found',
}) {}
