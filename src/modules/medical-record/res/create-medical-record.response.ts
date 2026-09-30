import { getBaseOkResponseSchema, getNormalErrorResponse, getValidationErrorResponse } from '@/common/swagger';
import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/appointment/:appointmentId';

export class CreateMedicalRecordResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  create: true,
  response: {
    message: 'Medical record created successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class CreateMedicalRecordBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [
    {
      field: 'diagnosis',
      error: 'Diagnosis should not be empty.',
    },
    {
      field: 'diagnosis',
      error: 'Diagnosis must be a string.',
    },
  ],
}) {}

export class CreateMedicalRecordConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'Medical record already exists for this appointment.',
  error: 'Medical Record Already Exists',
}) {}

export class CreateMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Appointment not found in database.',
  error: 'Appointment Not Found',
}) {}
