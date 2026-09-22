import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSpecialtiesResponse } from '@/types';
import { doctorSpecialtiesResponseSchema } from './doctor-specialty.response';

const path = 'doctor-specialties/doctors/:doctorId';

export class FindDoctorSpecialtiesResponse extends getBaseOkResponseSchema<DoctorSpecialtiesResponse>({
  path,
  response: {
    message: 'Doctor specialties retrieved successfully.',
    data: doctorSpecialtiesResponseSchema,
  },
}) {}

export class FindDoctorSpecialtiesNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
}) {}
