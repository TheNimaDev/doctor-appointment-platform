import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSchedulesResponse } from '@/types';
import { doctorSchedulesResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my/clinic/:clinicId';

export class FindMyDoctorSchedulesByClinicResponse extends getBaseOkResponseSchema<DoctorSchedulesResponse>({
  path,
  response: {
    message: 'Doctor schedules retrieved successfully.',
    data: doctorSchedulesResponseSchema,
  },
}) {}

export class FindMyDoctorSchedulesByClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
  path,
  statusCode: 404,
}) {}
