import { getBaseOkResponseSchema, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules';

export class FindAllDoctorSchedulesResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Doctor schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}

export class FindAllDoctorSchedulesBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [{ field: 'status', error: 'Status must be a valid schedule status.' }],
}) {}
