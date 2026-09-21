import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotResponse } from '@/types';
import { timeSlotResponseSchema } from './time-slot.response';

const path = 'time-slot/my-clinic/:id';

export class FindMyClinicAdminTimeSlotResponse extends getBaseOkResponseSchema<TimeSlotResponse>({
  path,
  response: {
    message: 'Time slot retrieved successfully.',
    data: timeSlotResponseSchema,
  },
}) {}

export class FindMyClinicAdminTimeSlotNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Time slot not found in your clinic.',
  error: 'Time Slot Not Found',
}) {}
