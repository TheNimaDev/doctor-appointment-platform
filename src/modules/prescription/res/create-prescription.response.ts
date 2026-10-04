import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';

import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/appointment/:appointmentId';

export class CreatePrescriptionResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  create: true,
  response: {
    message: 'Prescription created successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class CreatePrescriptionBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'notes',
      error: 'Notes must be a string.',
    },
  ],
}) {}

export class CreatePrescriptionConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Prescription already exists for this appointment.',
  error: 'Prescription Already Exists',
}) {}

export class CreatePrescriptionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
}) {}
