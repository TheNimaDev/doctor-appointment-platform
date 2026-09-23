import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/:id/cancel';

export class CancelAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Appointment cancelled successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class CancelAppointmentBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'reason',
      error: 'Reason must not exceed 500 characters.',
    },
  ],
}) {}

export class CancelAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
