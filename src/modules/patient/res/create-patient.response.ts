import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PatientResponse } from '@/types';
import { patientResponseSchema } from './patient.response';

const path = 'patients';

export class CreatePatientResponse extends getBaseOkResponseSchema<PatientResponse>({
  path,
  create: true,
  response: {
    message: 'Patient created successfully.',
    data: patientResponseSchema,
  },
}) {}

export class CreatePatientBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'nationalCode',
      error: 'National code must be exactly 10 characters.',
    },
    {
      field: 'gender',
      error: 'Gender must be a valid value.',
    },
  ],
}) {}

export class CreatePatientConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Patient already exists in database, please change nationalCode.',
  error: 'Patient already exists',
}) {}
