import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/all/appointment/:appointmentId';

export class FindPrescriptionByAppointmentResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindPrescriptionByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found for this appointment.',
  error: 'Prescription Not Found',
}) {}
