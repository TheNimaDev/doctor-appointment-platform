import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/all/:id';

export class FindAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Appointment retrieved successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class FindAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
