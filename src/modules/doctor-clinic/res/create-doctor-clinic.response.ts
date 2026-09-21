import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorClinicResponse } from '@/types';
import { doctorClinicResponseSchema } from './doctor-clinic.response';

const path = 'doctor-clinics/:doctorId';

export class CreateDoctorClinicResponse extends getBaseOkResponseSchema<DoctorClinicResponse>({
  path,
  create: true,
  response: {
    message: 'Doctor-clinic relation created successfully.',
    data: doctorClinicResponseSchema,
  },
}) {}

export class CreateDoctorClinicConflictResponse extends getNormalErrorResponse({
  path,
  statusCode: 409,
  message: 'DoctorClinic already exists in database, please change doctorId or clinicId.',
  error: 'DoctorClinic already exists',
}) {}

export class CreateDoctorClinicNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
}) {}
