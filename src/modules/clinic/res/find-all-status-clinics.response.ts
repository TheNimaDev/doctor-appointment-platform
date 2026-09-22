import { getBaseOkResponseSchema, getValidationErrorResponse } from '@/common/swagger';
import type { ClinicsResponse } from '@/types';
import { clinicsResponseSchema } from './clinic.response';

const path = 'clinics/all';

export class FindClinicsWithAllStatusResponse extends getBaseOkResponseSchema<ClinicsResponse>({
  path,
  response: {
    message: 'Clinics retrieved successfully.',
    data: clinicsResponseSchema,
  },
}) {}

export class FindClinicsWithAllStatusBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [{ field: 'status', error: 'Status must be a valid clinic status.' }],
}) {}
