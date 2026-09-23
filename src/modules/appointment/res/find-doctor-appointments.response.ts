import { getBaseOkResponseSchema } from '@/common/swagger';
import type { AppointmentsResponse } from '@/types';
import { appointmentsResponseSchema } from './appointment.response';

const path = 'appointments/doctor';

export class FindDoctorAppointmentsResponse extends getBaseOkResponseSchema<AppointmentsResponse>({
  path,
  response: {
    message: 'Doctor appointments retrieved successfully.',
    data: appointmentsResponseSchema,
  },
}) {}
