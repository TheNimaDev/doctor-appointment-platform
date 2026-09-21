import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { SpecialtyResponse } from '@/types';
import { specialtyResponseSchema } from './specialty.response';

const path = 'specialties/:idOrSlug';

/** Swagger response schema for successfully retrieving a specialty. */
export class FindSpecialtyResponse extends getBaseOkResponseSchema<SpecialtyResponse>({
  path,
  response: {
    message: 'Specialty retrieved successfully.',
    data: specialtyResponseSchema,
  },
}) {}

/** Swagger response schema for a missing specialty. */
export class FindSpecialtyNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Specialty not found in database.',
  error: 'Specialty Not Found',
}) {}
