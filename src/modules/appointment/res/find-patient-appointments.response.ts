import { getBaseOkResponseSchema } from '@/common/swagger';
import type { AppointmentsResponse } from '@/types';
import { appointmentsResponseSchema } from './appointment.response';

const path = 'appointments';

export class FindPatientAppointmentsResponse extends getBaseOkResponseSchema<AppointmentsResponse>({
  path,
  response: {
    message: 'Patient appointments retrieved successfully.',
    data: appointmentsResponseSchema,
  },
}) {}
