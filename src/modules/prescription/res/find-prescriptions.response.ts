import { getBaseOkResponseSchema } from '@/common/swagger';

import type { PrescriptionsResponse } from '@/types';
import { prescriptionsResponseSchema } from './prescription.response';

const path = 'prescriptions/all';

export class FindPrescriptionsResponse extends getBaseOkResponseSchema<PrescriptionsResponse>({
  path,
  response: {
    message: 'Prescriptions retrieved successfully.',
    data: prescriptionsResponseSchema,
  },
}) {}
