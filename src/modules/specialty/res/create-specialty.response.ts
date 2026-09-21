import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { SpecialtyResponse } from '@/types';
import { specialtyResponseSchema } from './specialty.response';

const path = 'specialties';

/** Swagger response schema for successfully creating a specialty. */
export class CreateSpecialtyResponse extends getBaseOkResponseSchema<SpecialtyResponse>({
  path,
  create: true,
  response: {
    message: 'Specialty created successfully.',
    data: specialtyResponseSchema,
  },
}) {}

/** Swagger response schema for invalid specialty creation data. */
export class CreateSpecialtyBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'name', error: 'Name must be at least 2 characters.' },
    { field: 'slug', error: 'Slug must be at least 2 characters.' },
    { field: 'description', error: 'Description must not exceed 2000 characters.' },
  ],
}) {}

/** Swagger response schema for a duplicate specialty name or slug. */
export class CreateSpecialtyConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Specialty already exists in database, please change name or slug.',
  error: 'Specialty already exists',
}) {}
