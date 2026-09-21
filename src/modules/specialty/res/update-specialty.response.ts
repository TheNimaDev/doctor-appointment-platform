import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { SpecialtyResponse } from '@/types';
import { specialtyResponseSchema } from './specialty.response';

const path = 'specialties/:id';

/** Swagger response schema for successfully updating a specialty. */
export class UpdateSpecialtyResponse extends getBaseOkResponseSchema<SpecialtyResponse>({
  path,
  response: {
    message: 'Specialty updated successfully.',
    data: specialtyResponseSchema,
  },
}) {}

/** Swagger response schema for invalid specialty update data. */
export class UpdateSpecialtyBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'name', error: 'Name must be at least 2 characters.' },
    { field: 'slug', error: 'Slug must be at least 2 characters.' },
    { field: 'description', error: 'Description must not exceed 2000 characters.' },
  ],
}) {}

/** Swagger response schema for a missing specialty during update. */
export class UpdateSpecialtyNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Specialty not found in database.',
  error: 'Specialty Not Found',
}) {}

/** Swagger response schema for a duplicate specialty name or slug during update. */
export class UpdateSpecialtyConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Specialty already exists in database, please change name or slug.',
  error: 'Specialty already exists',
}) {}
