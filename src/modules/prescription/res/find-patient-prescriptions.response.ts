import { getBaseOkResponseSchema } from '@/common/swagger';
import type { PrescriptionsResponse } from '@/types';
import { prescriptionsResponseSchema } from './prescription.response';

const path = 'prescriptions/my';

export class FindPatientPrescriptionsResponse extends getBaseOkResponseSchema<PrescriptionsResponse>({
  path,
  response: {
    message: 'Patient prescriptions retrieved successfully.',
    data: prescriptionsResponseSchema,
  },
}) {}
