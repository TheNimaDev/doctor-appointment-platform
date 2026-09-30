import { getBaseOkResponseSchema } from '@/common/swagger';
import type { MedicalRecordsResponse } from '@/types';
import { medicalRecordsResponseSchema } from './medical-record.response';

const path = 'medical-records/all';

export class FindMedicalRecordsResponse extends getBaseOkResponseSchema<MedicalRecordsResponse>({
  path,
  response: {
    message: 'Medical records retrieved successfully.',
    data: medicalRecordsResponseSchema,
  },
}) {}
