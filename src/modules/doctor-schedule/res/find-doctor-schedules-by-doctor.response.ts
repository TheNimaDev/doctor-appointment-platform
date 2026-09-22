import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/doctor/:doctorId';

export class FindDoctorSchedulesByDoctorResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Doctor schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}

export class FindDoctorSchedulesByDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}
