import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { RoleResponse } from '@/types';
import { roleResponseSchema } from './role.response';

const path = 'roles';

/** Swagger response schema for successfully creating a role. */
export class CreateRoleResponse extends getBaseOkResponseSchema<RoleResponse>({
  path,
  create: true,
  response: {
    message: 'Role created successfully.',
    data: roleResponseSchema,
  },
}) {}

/** Swagger response schema for invalid role creation data. */
export class CreateRoleBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'name',
      error: 'Name must be at least 2 characters.',
    },
    {
      field: 'description',
      error: 'Description must be at least 2 characters.',
    },
  ],
}) {}

/** Swagger response schema for a duplicate role name. */
export class CreateRoleConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Role already exists in database, please change name.',
  error: 'Role already exists',
}) {}
