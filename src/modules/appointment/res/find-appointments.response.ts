import { getBaseOkResponseSchema } from '@/common/swagger';
import type { AppointmentsResponse } from '@/types';
import { appointmentsResponseSchema } from './appointment.response';

const path = 'appointments/all';

export class FindAppointmentsResponse extends getBaseOkResponseSchema<AppointmentsResponse>({
  path,
  response: {
    message: 'Appointments retrieved successfully.',
    data: appointmentsResponseSchema,
  },
}) {}
