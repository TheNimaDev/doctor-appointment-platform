import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/all/:id';

export class FindPrescriptionResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindPrescriptionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found in database.',
  error: 'Prescription Not Found',
}) {}
