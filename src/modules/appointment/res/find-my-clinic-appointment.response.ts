import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/my-clinic/:id';

export class FindMyClinicAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Clinic appointment retrieved successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class FindMyClinicAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in your clinic.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
