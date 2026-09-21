import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'permissions/:id';

/** Swagger response schema for successfully deleting a permission. */
export class DeletePermissionResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Permission deleted successfully.',
  },
}) {}

/** Swagger response schema for a missing permission during deletion. */
export class DeletePermissionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Permission not found in database.',
  error: 'Permission Not Found',
}) {}
