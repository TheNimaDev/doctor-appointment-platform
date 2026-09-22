import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorResponse } from '@/types';
import { doctorResponseSchema } from './doctor.response';

const path = 'doctors/:id';

export class UpdateDoctorResponse extends getBaseOkResponseSchema<DoctorResponse>({
  path,
  response: { message: 'Doctor updated successfully.', data: doctorResponseSchema },
}) {}

export class UpdateDoctorBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'medicalCode', error: 'Medical code must not exceed 50 characters.' },
    { field: 'experienceYears', error: 'Experience years must be between 0 and 100.' },
    { field: 'consultationFee', error: 'Consultation fee must not exceed 20 characters.' },
  ],
}) {}

export class UpdateDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}

export class UpdateDoctorConflictResponse extends getNormalErrorResponse({
  message: 'Doctor already exists in database, please change medicalCode.',
  error: 'Doctor already exists',
  path,
  statusCode: 409,
}) {}
