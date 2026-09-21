import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotsResponse } from '@/types';
import { timeSlotsResponseSchema } from './time-slot.response';

const path = 'time-slot/my-clinic/doctors/:doctorId';

export class FindMyClinicAdminDoctorTimeSlotsResponse extends getBaseOkResponseSchema<TimeSlotsResponse>({
  path,
  response: {
    message: 'Doctor time slots retrieved successfully.',
    data: timeSlotsResponseSchema,
  },
}) {}

export class FindMyClinicAdminDoctorTimeSlotsNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor-clinic relation not found in database.',
  error: 'DoctorClinic Not Found',
}) {}
