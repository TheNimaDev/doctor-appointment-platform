import { getBaseOkResponseSchema, getValidationErrorResponse } from '@/common/swagger';
import type { PatientsResponse } from '@/types';
import { patientsResponseSchema } from './patient.response';

const path = 'patients';

export class FindPatientsResponse extends getBaseOkResponseSchema<PatientsResponse>({
  path,
  response: {
    message: 'Patients retrieved successfully.',
    data: patientsResponseSchema,
  },
}) {}

export class FindPatientsBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'gender',
      error: 'Gender must be a valid value.',
    },
  ],
}) {}
