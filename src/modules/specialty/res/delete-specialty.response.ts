import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'specialties/:id';

/** Swagger response schema for successfully deleting a specialty. */
export class DeleteSpecialtyResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Specialty deleted successfully.',
  },
}) {}

/** Swagger response schema for a missing specialty during deletion. */
export class DeleteSpecialtyNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Specialty not found in database.',
  error: 'Specialty Not Found',
}) {}
