import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/my/:id';

export class FindPatientPrescriptionResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Patient prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindPatientPrescriptionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found in database.',
  error: 'Prescription Not Found',
}) {}
