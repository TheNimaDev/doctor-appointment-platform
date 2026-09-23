import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/:id/reject';

export class RejectAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Appointment rejected successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class RejectAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
