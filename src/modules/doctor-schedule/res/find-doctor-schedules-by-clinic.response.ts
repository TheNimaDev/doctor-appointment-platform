import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/clinic/:clinicId';

export class FindDoctorSchedulesByClinicResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Clinic schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}

export class FindDoctorSchedulesByClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
  path,
  statusCode: 404,
}) {}
