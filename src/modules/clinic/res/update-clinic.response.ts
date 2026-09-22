import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { ClinicResponse } from '@/types';
import { clinicResponseSchema } from './clinic.response';

const path = 'clinics/:id';

export class UpdateClinicResponse extends getBaseOkResponseSchema<ClinicResponse>({
  path,
  response: {
    message: 'Clinic updated successfully.',
    data: clinicResponseSchema,
  },
}) {}

export class UpdateClinicBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'name', error: 'Name must be at least 2 characters.' },
    { field: 'address', error: 'Address must not exceed 5000 characters.' },
    { field: 'city', error: 'City must not exceed 100 characters.' },
    { field: 'latitude', error: 'Latitude must be a valid latitude.' },
    { field: 'longitude', error: 'Longitude must be a valid longitude.' },
  ],
}) {}

export class UpdateClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
  path,
  statusCode: 404,
}) {}

export class UpdateClinicConflictResponse extends getNormalErrorResponse({
  message: 'Clinic already exists in database, please change name.',
  error: 'Clinic already exists',
  path,
  statusCode: 409,
}) {}
