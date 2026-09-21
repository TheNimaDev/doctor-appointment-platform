import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotsResponse } from '@/types';
import { timeSlotsResponseSchema } from './time-slot.response';

const path = 'time-slot/my-clinic';

export class FindMyClinicAdminTimeSlotsResponse extends getBaseOkResponseSchema<TimeSlotsResponse>({
  path,
  response: {
    message: 'Clinic time slots retrieved successfully.',
    data: timeSlotsResponseSchema,
  },
}) {}

export class FindMyClinicAdminTimeSlotsNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
}) {}
