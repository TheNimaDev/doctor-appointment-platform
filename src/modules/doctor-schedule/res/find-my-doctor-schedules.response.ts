import { getBaseOkResponseSchema } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my';

export class FindMyDoctorSchedulesResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Doctor schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}
