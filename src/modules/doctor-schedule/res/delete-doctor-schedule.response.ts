import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'doctor-schedules/my-clinic/:scheduleId';

export class DeleteDoctorScheduleForClinicResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Doctor schedule deleted successfully.',
  },
}) {}

export class DeleteDoctorScheduleForClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor schedule not found in database.',
  error: 'Doctor Schedule Not Found',
  path,
  statusCode: 404,
}) {}
