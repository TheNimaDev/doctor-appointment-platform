import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorSpecialtyResponse } from '@/types';
import { doctorSpecialtyResponseSchema } from './doctor-specialty.response';

const path = 'doctor-specialties/my';

export class AddDoctorSpecialtyResponse extends getBaseOkResponseSchema<DoctorSpecialtyResponse>({
  path,
  create: true,
  response: {
    message: 'Specialty added to doctor successfully.',
    data: doctorSpecialtyResponseSchema,
  },
}) {}

export class AddDoctorSpecialtyBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'specialtyId', error: 'Specialty ID must be a valid UUID.' },
    { field: 'isPrimary', error: 'isPrimary must be a boolean value.' },
  ],
}) {}

export class AddDoctorSpecialtyNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Specialty not found in database.',
  error: 'Specialty Not Found',
}) {}

export class AddDoctorSpecialtyConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'This specialty is already assigned to the doctor.',
  error: 'Doctor Specialty Already Exists',
}) {}
