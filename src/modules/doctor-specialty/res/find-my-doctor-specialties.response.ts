import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSpecialtiesResponse } from '@/types';
import { doctorSpecialtiesResponseSchema } from './doctor-specialty.response';

const path = 'doctor-specialties/my';

export class FindMyDoctorSpecialtiesResponse extends getBaseOkResponseSchema<DoctorSpecialtiesResponse>({
  path,
  response: {
    message: 'Doctor specialties retrieved successfully.',
    data: doctorSpecialtiesResponseSchema,
  },
}) {}

export class FindMyDoctorSpecialtiesNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
}) {}
