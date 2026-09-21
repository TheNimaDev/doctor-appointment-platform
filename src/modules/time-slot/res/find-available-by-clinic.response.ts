import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotsResponse } from '@/types';
import { timeSlotsResponseSchema } from './time-slot.response';

const path = 'time-slot/clinics/:clinicId';

export class FindAvailableByClinicResponse extends getBaseOkResponseSchema<TimeSlotsResponse>({
  path,
  response: {
    message: 'Available time slots retrieved successfully.',
    data: timeSlotsResponseSchema,
  },
}) {}

export class FindAvailableByClinicNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
}) {}
