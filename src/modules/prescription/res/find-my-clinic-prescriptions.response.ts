import { getBaseOkResponseSchema } from '@/common/swagger';
import type { PrescriptionsResponse } from '@/types';
import { prescriptionsResponseSchema } from './prescription.response';

const path = 'prescriptions/my-clinic';

export class FindMyClinicPrescriptionsResponse extends getBaseOkResponseSchema<PrescriptionsResponse>({
  path,
  response: {
    message: 'Clinic prescriptions retrieved successfully.',
    data: prescriptionsResponseSchema,
  },
}) {}
