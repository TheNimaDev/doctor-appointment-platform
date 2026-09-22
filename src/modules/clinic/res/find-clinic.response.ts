import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { ClinicResponse } from '@/types';
import { clinicResponseSchema } from './clinic.response';

const path = 'clinics/:id';

export class FindClinicResponse extends getBaseOkResponseSchema<ClinicResponse>({
  path,
  response: {
    message: 'Clinic retrieved successfully.',
    data: clinicResponseSchema,
  },
}) {}

export class FindClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
  path,
  statusCode: 404,
}) {}
