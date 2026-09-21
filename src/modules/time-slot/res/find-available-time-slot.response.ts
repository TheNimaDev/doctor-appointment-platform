import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotResponse } from '@/types';
import { timeSlotResponseSchema } from './time-slot.response';

const path = 'time-slot/:id';

export class FindAvailableTimeSlotResponse extends getBaseOkResponseSchema<TimeSlotResponse>({
  path,
  response: {
    message: 'Time slot retrieved successfully.',
    data: timeSlotResponseSchema,
  },
}) {}

export class FindAvailableTimeSlotNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Time slot not found in database.',
  error: 'Time Slot Not Found',
}) {}
