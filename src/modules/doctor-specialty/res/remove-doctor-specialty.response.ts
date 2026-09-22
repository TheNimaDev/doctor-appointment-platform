import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'doctor-specialties/my/:specialtyId';

export class RemoveDoctorSpecialtyResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Specialty removed from doctor successfully.',
  },
}) {}

export class RemoveDoctorSpecialtyNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor specialty relation not found in database.',
  error: 'Doctor Specialty Not Found',
}) {}
