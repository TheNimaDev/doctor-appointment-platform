import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { ClinicResponse } from '@/types';
import { clinicResponseSchema } from './clinic.response';

const path = 'clinics';

export class CreateClinicResponse extends getBaseOkResponseSchema<ClinicResponse>({
  path,
  create: true,
  response: {
    message: 'Clinic created successfully.',
    data: clinicResponseSchema,
  },
}) {}

export class CreateClinicBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'name', error: 'Name must be at least 2 characters.' },
    { field: 'address', error: 'Address must not exceed 5000 characters.' },
    { field: 'city', error: 'City must not exceed 100 characters.' },
    { field: 'latitude', error: 'Latitude must be a valid latitude.' },
    { field: 'longitude', error: 'Longitude must be a valid longitude.' },
  ],
}) {}

export class CreateClinicConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Clinic already exists in database, please change name.',
  error: 'Clinic already exists',
}) {}
