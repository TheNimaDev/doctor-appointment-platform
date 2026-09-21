import { getBaseOkResponseSchema } from '@/common/swagger';
import type { PermissionsResponse } from '@/types';
import { permissionsResponseSchema } from './permission.response';

const path = 'permissions';

/** Swagger response schema for successfully retrieving all permissions. */
export class FindPermissionsResponse extends getBaseOkResponseSchema<PermissionsResponse>({
  path,
  response: {
    message: 'Permissions retrieved successfully.',
    data: permissionsResponseSchema,
  },
}) {}
