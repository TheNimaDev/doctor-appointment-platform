import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/:id/complete';

export class CompleteAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Appointment completed successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class CompleteAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
