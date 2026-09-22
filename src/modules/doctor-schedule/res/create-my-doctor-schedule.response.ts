import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorScheduleResponse } from '@/types';
import { doctorScheduleResponseSchema } from './doctor-schedule.response';

const path = 'doctor-schedules/my';

export class CreateMyDoctorScheduleResponse extends getBaseOkResponseSchema<DoctorScheduleResponse>({
  path,
  response: {
    message: 'Doctor schedule created successfully.',
    data: doctorScheduleResponseSchema,
  },
}) {}

export class CreateMyDoctorScheduleBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'clinicId',
      error: 'Clinic ID must be a valid UUID.',
    },
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

export class CreateMyDoctorScheduleConflictResponse extends getNormalErrorResponse({
  message: 'DoctorSchedule already exists in database.',
  error: 'DoctorSchedule already exists',
  path,
  statusCode: 409,
}) {}

export class CreateMyDoctorScheduleNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule resource not found in database.',
  error: 'Doctor Schedule Resource Not Found',
  path,
  statusCode: 404,
}) {}
