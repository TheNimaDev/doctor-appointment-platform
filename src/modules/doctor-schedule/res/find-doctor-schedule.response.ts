import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorScheduleResponse } from '@/types';
import { doctorScheduleResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/:scheduleId';

export class FindDoctorScheduleResponse extends getBaseOkResponseSchema<DoctorScheduleResponse>({
  path,
  response: {
    message: 'Doctor schedule retrieved successfully.',
    data: doctorScheduleResponseSchema,
  },
}) {}

export class FindDoctorScheduleNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule not found in database.',
  error: 'Doctor Schedule Not Found',
  path,
  statusCode: 404,
}) {}
