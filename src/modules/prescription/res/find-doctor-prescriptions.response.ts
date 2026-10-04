import { getBaseOkResponseSchema } from '@/common/swagger';
import type { PrescriptionsResponse } from '@/types';
import { prescriptionsResponseSchema } from './prescription.response';

const path = 'prescriptions/doctor';

export class FindDoctorPrescriptionsResponse extends getBaseOkResponseSchema<PrescriptionsResponse>({
  path,
  response: {
    message: 'Doctor prescriptions retrieved successfully.',
    data: prescriptionsResponseSchema,
  },
}) {}
