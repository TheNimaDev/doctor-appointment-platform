import { getBaseOkResponseSchema } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my-clinic';

export class FindMyClinicSchedulesResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Clinic schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}
