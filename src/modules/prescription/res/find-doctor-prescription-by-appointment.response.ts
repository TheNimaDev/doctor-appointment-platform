import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { PrescriptionResponse } from '@/types';
import { prescriptionResponseSchema } from './prescription.response';

const path = 'prescriptions/doctor/appointment/:appointmentId';

export class FindDoctorPrescriptionByAppointmentResponse extends getBaseOkResponseSchema<PrescriptionResponse>({
  path,
  response: {
    message: 'Doctor prescription retrieved successfully.',
    data: prescriptionResponseSchema,
  },
}) {}

export class FindDoctorPrescriptionByAppointmentNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found for this appointment.',
  error: 'Prescription Not Found',
}) {}
