import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorScheduleResponse } from '@/types';
import { doctorScheduleResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my-clinic/:scheduleId';

export class UpdateDoctorScheduleForClinicResponse extends getBaseOkResponseSchema<DoctorScheduleResponse>({
  path,
  response: {
    message: 'Doctor schedule updated successfully.',
    data: doctorScheduleResponseSchema,
  },
}) {}

export class UpdateDoctorScheduleForClinicBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'dayOfWeek',
      error: 'Day of week must be valid.',
    },
    {
      field: 'startTime',
      error: 'Start time must be in HH:mm format.',
    },
    {
      field: 'endTime',
      error: 'End time must be in HH:mm format.',
    },
    {
      field: 'slotDuration',
      error: 'Slot duration must be between 1 and 240.',
    },
  ],
}) {}

export class UpdateDoctorScheduleForClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule not found in database.',
  error: 'Doctor Schedule Not Found',
  path,
  statusCode: 404,
}) {}
