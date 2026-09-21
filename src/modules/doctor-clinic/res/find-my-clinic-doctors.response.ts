import { getBaseOkResponseSchema } from '@/common/swagger';
import type { DoctorClinicsResponse } from '@/types';
import { doctorClinicsResponseSchema } from './doctor-clinic.response';

const path = 'doctor-clinics/my-clinic';

export class FindMyClinicDoctorsResponse extends getBaseOkResponseSchema<DoctorClinicsResponse>({
  path,
  response: {
    message: 'Clinic doctors retrieved successfully.',
    data: doctorClinicsResponseSchema,
  },
}) {}
