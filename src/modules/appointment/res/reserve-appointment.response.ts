import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments';

export class ReserveAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  create: true,
  response: {
    message: 'Appointment reserved successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class ReserveAppointmentBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'timeSlotId',
      error: 'Time slot ID must be a valid UUID.',
    },
  ],
}) {}

export class ReserveAppointmentConflictResponse extends getNormalErrorResponse({
  message: 'Time slot is no longer available.',
  error: 'Time Slot Not Available',
  path,
  statusCode: 409,
}) {}
