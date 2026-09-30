import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';

import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/:id';

export class UpdateMedicalRecordResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Medical record updated successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class UpdateMedicalRecordBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'diagnosis',
      error: 'Diagnosis must be a string.',
    },
    {
      field: 'description',
      error: 'Description must be a string.',
    },
    {
      field: 'notes',
      error: 'Notes must be a string.',
    },
  ],
}) {}

export class UpdateMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found in database.',
  error: 'Medical Record Not Found',
}) {}
