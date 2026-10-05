import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/:id/items';

export class CreatePrescriptionItemsResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  create: true,
  response: {
    message: 'Prescription items created successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class CreatePrescriptionItemsBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'medicineName',
      error: 'Medicine name must be a string.',
    },
    {
      field: 'dosage',
      error: 'Dosage must be a string.',
    },
    {
      field: 'usage',
      error: 'Usage must be a string.',
    },
    {
      field: 'duration',
      error: 'Duration must be a string.',
    },
    {
      field: 'quantity',
      error: 'Quantity must be a number.',
    },
  ],
}) {}

export class CreatePrescriptionItemsNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found in database.',
  error: 'Prescription Not Found',
}) {}
