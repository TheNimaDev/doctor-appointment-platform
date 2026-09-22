import { getBaseOkResponseSchema } from '@/common/swagger';
import type { ClinicsResponse } from '@/types';
import { clinicsResponseSchema } from './clinic.response';

const path = 'clinics';

export class FindClinicsResponse extends getBaseOkResponseSchema<ClinicsResponse>({
  path,
  response: {
    message: 'Clinics retrieved successfully.',
    data: clinicsResponseSchema,
  },
}) {}
