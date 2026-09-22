import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorScheduleResponse } from '@/types';
import { doctorScheduleResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my-clinic/:scheduleId/status';

export class UpdateDoctorScheduleStatusForClinicResponse extends getBaseOkResponseSchema<DoctorScheduleResponse>({
  path,
  response: {
    message: 'Doctor schedule status updated successfully.',
    data: doctorScheduleResponseSchema,
  },
}) {}

export class UpdateDoctorScheduleStatusForClinicBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'status',
      error: 'Status must be a valid schedule status.',
    },
  ],
}) {}

export class UpdateDoctorScheduleStatusForClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule not found in database.',
  error: 'Doctor Schedule Not Found',
  path,
  statusCode: 404,
}) {}
