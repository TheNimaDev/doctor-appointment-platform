import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/my-clinic/appointment/:appointmentId';

export class FindMyClinicPrescriptionByAppointmentResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Clinic prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindMyClinicPrescriptionByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found for this appointment.',
  error: 'Prescription Not Found',
}) {}
