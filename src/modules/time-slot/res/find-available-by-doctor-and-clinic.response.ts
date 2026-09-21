import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { TimeSlotsResponse } from '@/types';
import { timeSlotsResponseSchema } from './time-slot.response';

const path = 'time-slot/doctors/:doctorId/clinics/:clinicId';

export class FindAvailableByDoctorAndClinicResponse extends getBaseOkResponseSchema<TimeSlotsResponse>({
  path,
  response: {
    message: 'Available time slots retrieved successfully.',
    data: timeSlotsResponseSchema,
  },
}) {}

export class FindAvailableByDoctorAndClinicNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor, clinic, or doctor-clinic relation not found in database.',
  error: 'Doctor, Clinic, or DoctorClinic Not Found',
}) {}
