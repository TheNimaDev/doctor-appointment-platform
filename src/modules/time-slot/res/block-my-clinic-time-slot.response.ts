import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotResponse } from '@/types';
import { timeSlotResponseSchema } from './time-slot.response';

const path = 'time-slot/my-clinic/:id/block';

export class BlockMyClinicTimeSlotResponse extends getBaseOkResponseSchema<TimeSlotResponse>({
  path,
  response: {
    message: 'Time slot blocked successfully.',
    data: timeSlotResponseSchema,
  },
}) {}

export class BlockMyClinicTimeSlotNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Time slot not found in database.',
  error: 'Time Slot Not Found',
}) {}
