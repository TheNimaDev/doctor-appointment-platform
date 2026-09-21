import { getBaseOkResponseSchema } from '@/common/swagger';
import type { DoctorClinicsResponse } from '@/types';
import { doctorClinicsResponseSchema } from './doctor-clinic.response';

const path = 'doctor-clinics/my';

export class FindMyDoctorClinicsResponse extends getBaseOkResponseSchema<DoctorClinicsResponse>({
  path,
  response: {
    message: 'Doctor clinics retrieved successfully.',
    data: doctorClinicsResponseSchema,
  },
}) {}
