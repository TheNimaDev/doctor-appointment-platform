import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/:id/confirm';

export class ConfirmAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Appointment confirmed successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class ConfirmAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
