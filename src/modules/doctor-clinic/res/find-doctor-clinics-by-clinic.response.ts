import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorClinicsResponse } from '@/types';
import { doctorClinicsResponseSchema } from './doctor-clinic.response';

const path = 'doctor-clinics/clinic/:clinicId';

export class FindDoctorClinicsByClinicResponse extends getBaseOkResponseSchema<DoctorClinicsResponse>({
  path,
  response: {
    message: 'Clinic doctors retrieved successfully.',
    data: doctorClinicsResponseSchema,
  },
}) {}

export class FindDoctorClinicsByClinicNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
}) {}
