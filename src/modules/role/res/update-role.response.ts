import {
  getBaseOkResponseSchema,
  getNormalErrorResponse,
  getValidationErrorResponse,
} from '@/common/swagger';
import type { RoleResponse } from '@/types';
import { roleResponseSchema } from './role.response';

const path = 'roles/:id';

/** Swagger response schema for successfully updating a role. */
export class UpdateRoleResponse extends getBaseOkResponseSchema<RoleResponse>({
  path,
  response: {
    message: 'Role updated successfully.',
    data: roleResponseSchema,
  },
}) {}

/** Swagger response schema for invalid role update data. */
export class UpdateRoleBadRequestResponse extends getValidationErrorResponse({
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

/** Swagger response schema for a missing role during update. */
export class UpdateRoleNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Role not found in database.',
  error: 'Role Not Found',
}) {}

/** Swagger response schema for a duplicate role name during update. */
export class UpdateRoleConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Role already exists in database, please change name.',
  error: 'Role already exists',
}) {}
