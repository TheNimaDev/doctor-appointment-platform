import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotsResponse } from '@/types';
import { timeSlotsResponseSchema } from './time-slot.response';

const path = 'time-slot/my/clinics/:clinicId';

export class FindMyClinicTimeSlotsResponse extends getBaseOkResponseSchema<TimeSlotsResponse>({
  path,
  response: {
    message: 'Time slots retrieved successfully.',
    data: timeSlotsResponseSchema,
  },
}) {}

export class FindMyClinicTimeSlotsNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Clinic or doctor-clinic relation not found in database.',
  error: 'Clinic or DoctorClinic Not Found',
}) {}
