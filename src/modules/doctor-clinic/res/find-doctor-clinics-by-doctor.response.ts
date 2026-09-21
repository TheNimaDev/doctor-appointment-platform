import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorClinicsResponse } from '@/types';
import { doctorClinicsResponseSchema } from './doctor-clinic.response';

const path = 'doctor-clinics/doctor/:doctorId';

export class FindDoctorClinicsByDoctorResponse extends getBaseOkResponseSchema<DoctorClinicsResponse>({
  path,
  response: {
    message: 'Doctor clinics retrieved successfully.',
    data: doctorClinicsResponseSchema,
  },
}) {}

export class FindDoctorClinicsByDoctorNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
}) {}
