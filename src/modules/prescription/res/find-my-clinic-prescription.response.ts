import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/my-clinic/:id';

export class FindMyClinicPrescriptionResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Clinic prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindMyClinicPrescriptionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found in database.',
  error: 'Prescription Not Found',
}) {}
