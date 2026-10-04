import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/:id';

export class UpdatePrescriptionResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Prescription updated successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class UpdatePrescriptionBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'notes',
      error: 'Notes must be a string.',
    },
  ],
}) {}

export class UpdatePrescriptionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found in database.',
  error: 'Prescription Not Found',
}) {}
