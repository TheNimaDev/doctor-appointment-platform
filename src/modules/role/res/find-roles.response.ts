import { getBaseOkResponseSchema } from '@/common/swagger';
import type { RolesResponse } from '@/types';
import { rolesResponseSchema } from './role.response';

const path = 'roles';

/** Swagger response schema for successfully retrieving all roles. */
export class FindRolesResponse extends getBaseOkResponseSchema<RolesResponse>({
  path,
  response: {
    message: 'Roles retrieved successfully.',
    data: rolesResponseSchema,
  },
}) {}
