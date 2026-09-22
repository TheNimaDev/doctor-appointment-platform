import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'doctor-schedules/my/:scheduleId';

export class DeleteMyDoctorScheduleResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Doctor schedule deleted successfully.',
  },
}) {}

export class DeleteMyDoctorScheduleNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule not found in database.',
  error: 'Doctor Schedule Not Found',
  path,
  statusCode: 404,
}) {}
