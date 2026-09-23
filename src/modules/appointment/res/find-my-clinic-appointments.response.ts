import { getBaseOkResponseSchema } from '@/common/swagger';
import type { AppointmentsResponse } from '@/types';
import { appointmentsResponseSchema } from './appointment.response';

const path = 'appointments/my-clinic';

export class FindMyClinicAppointmentsResponse extends getBaseOkResponseSchema<AppointmentsResponse>({
  path,
  response: {
    message: 'Clinic appointments retrieved successfully.',
    data: appointmentsResponseSchema,
  },
}) {}
