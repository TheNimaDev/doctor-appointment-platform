import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/item/:id';

export class UpdatePrescriptionItemResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Prescription item updated successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class UpdatePrescriptionItemBadRequestResponse extends getValidationErrorResponse({
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

export class UpdatePrescriptionItemNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription item not found in database.',
  error: 'Prescription Item Not Found',
}) {}
