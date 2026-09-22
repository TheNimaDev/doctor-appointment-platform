import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorResponse } from '@/types';
import { doctorResponseSchema } from './doctor.response';

const path = 'doctors';

export class UpdateMyDoctorResponse extends getBaseOkResponseSchema<DoctorResponse>({
  path,
  response: { message: 'Doctor updated successfully.', data: doctorResponseSchema },
}) {}

export class UpdateMyDoctorBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    { field: 'medicalCode', error: 'Medical code must not exceed 50 characters.' },
    { field: 'experienceYears', error: 'Experience years must be between 0 and 100.' },
    { field: 'consultationFee', error: 'Consultation fee must not exceed 20 characters.' },
  ],
}) {}

export class UpdateMyDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}
