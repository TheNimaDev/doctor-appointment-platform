import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotResponse } from '@/types';
import { timeSlotResponseSchema } from './time-slot.response';

const path = 'time-slot/my-clinic/:id/unblock';

export class UnblockMyClinicTimeSlotResponse extends getBaseOkResponseSchema<TimeSlotResponse>({
  path,
  response: {
    message: 'Time slot unblocked successfully.',
    data: timeSlotResponseSchema,
  },
}) {}

export class UnblockMyClinicTimeSlotNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Time slot not found in database.',
  error: 'Time Slot Not Found',
}) {}
