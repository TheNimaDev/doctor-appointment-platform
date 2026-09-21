import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotResponse } from '@/types';
import { timeSlotResponseSchema } from './time-slot.response';

const path = 'time-slot/my/:id/block';

export class BlockMyTimeSlotResponse extends getBaseOkResponseSchema<TimeSlotResponse>({
  path,
  response: {
    message: 'Time slot blocked successfully.',
    data: timeSlotResponseSchema,
  },
}) {}

export class BlockMyTimeSlotNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Time slot not found in database.',
  error: 'Time Slot Not Found',
}) {}
