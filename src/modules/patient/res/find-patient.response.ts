import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PatientResponse } from '@/types';
import { patientResponseSchema } from './patient.response';

const path = 'patients/:id';

export class FindPatientResponse extends getBaseOkResponseSchema<PatientResponse>({
  path,
  response: {
    message: 'Patient retrieved successfully.',
    data: patientResponseSchema,
  },
}) {}

export class FindPatientNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Patient not found in database.',
  error: 'Patient Not Found',
}) {}
