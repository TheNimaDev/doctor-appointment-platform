import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotsResponse } from '@/types';
import { timeSlotsResponseSchema } from './time-slot.response';

const path = 'time-slot/doctors/:doctorId';

export class FindAvailableByDoctorResponse extends getBaseOkResponseSchema<TimeSlotsResponse>({
  path,
  response: {
    message: 'Available time slots retrieved successfully.',
    data: timeSlotsResponseSchema,
  },
}) {}

export class FindAvailableByDoctorNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
}) {}
