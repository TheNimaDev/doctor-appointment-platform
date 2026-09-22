import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorScheduleResponse } from '@/types';
import { doctorScheduleResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my/:scheduleId/status';

export class UpdateMyDoctorScheduleStatusResponse extends getBaseOkResponseSchema<DoctorScheduleResponse>({
  path,
  response: {
    message: 'Doctor schedule status updated successfully.',
    data: doctorScheduleResponseSchema,
  },
}) {}

export class UpdateMyDoctorScheduleStatusBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'status',
      error: 'Status must be a valid schedule status.',
    },
  ],
}) {}

export class UpdateMyDoctorScheduleStatusNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule not found in database.',
  error: 'Doctor Schedule Not Found',
  path,
  statusCode: 404,
}) {}
