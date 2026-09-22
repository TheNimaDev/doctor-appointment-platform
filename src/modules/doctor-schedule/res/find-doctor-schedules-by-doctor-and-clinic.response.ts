import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/doctor/:doctorId/clinic/:clinicId';

export class FindDoctorSchedulesByDoctorAndClinicResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Clinic schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}

export class FindDoctorSchedulesByDoctorAndClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor or clinic not found in database.',
  error: 'Doctor or Clinic Not Found',
  path,
  statusCode: 404,
}) {}
