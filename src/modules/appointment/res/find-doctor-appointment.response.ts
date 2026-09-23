import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { AppointmentResponse } from '@/types';
import { appointmentResponseSchema } from './appointment.response';

const path = 'appointments/doctor/:id';

export class FindDoctorAppointmentResponse extends getBaseOkResponseSchema<AppointmentResponse>({
  path,
  response: {
    message: 'Doctor appointment retrieved successfully.',
    data: appointmentResponseSchema,
  },
}) {}

export class FindDoctorAppointmentNotFoundResponse extends getNormalErrorResponse({
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
  path,
  statusCode: 404,
}) {}
