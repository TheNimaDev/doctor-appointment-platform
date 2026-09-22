import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorResponse } from '@/types';
import { doctorResponseSchema } from './doctor.response';

const path = 'doctors';

export class CreateDoctorResponse extends getBaseOkResponseSchema<DoctorResponse>({
  path,
  create: true,
  response: { message: 'Doctor request created successfully.', data: doctorResponseSchema },
}) {}

export class CreateDoctorBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'medicalCode', error: 'Medical code must not exceed 50 characters.' },
    { field: 'experienceYears', error: 'Experience years must be between 0 and 100.' },
    { field: 'consultationFee', error: 'Consultation fee must not exceed 20 characters.' },
  ],
}) {}

export class CreateDoctorConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Doctor already exists in database, please change medicalCode.',
  error: 'Doctor already exists',
}) {}
