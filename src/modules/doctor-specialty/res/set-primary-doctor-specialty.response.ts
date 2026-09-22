import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorSpecialtyResponse } from '@/types';
import { doctorSpecialtyResponseSchema } from './doctor-specialty.response';

const path = 'doctor-specialties/my/:specialtyId/primary';

export class SetDoctorSpecialtyPrimaryResponse extends getBaseOkResponseSchema<DoctorSpecialtyResponse>({
  path,
  response: {
    message: 'Primary specialty updated successfully.',
    data: doctorSpecialtyResponseSchema,
  },
}) {}

export class SetDoctorSpecialtyPrimaryNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor specialty relation not found in database.',
  error: 'Doctor Specialty Not Found',
}) {}
