import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PatientResponse } from '@/types';
import { patientResponseSchema } from './patient.response';

const path = 'patients/:id';

export class UpdatePatientResponse extends getBaseOkResponseSchema<PatientResponse>({
  path,
  response: {
    message: 'Patient updated successfully.',
    data: patientResponseSchema,
  },
}) {}

export class UpdatePatientBadRequestResponse extends getValidationErrorResponse({
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

export class UpdatePatientConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Patient already exists in database, please change nationalCode.',
  error: 'Patient already exists',
}) {}

export class UpdatePatientNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Patient not found in database.',
  error: 'Patient Not Found',
}) {}
