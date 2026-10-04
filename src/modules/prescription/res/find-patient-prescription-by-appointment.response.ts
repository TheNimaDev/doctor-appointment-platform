import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/my/appointment/:appointmentId';

export class FindPatientPrescriptionByAppointmentResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Patient prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindPatientPrescriptionByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found for this appointment.',
  error: 'Prescription Not Found',
}) {}
