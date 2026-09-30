import { getBaseOkResponseSchema } from '@/common/swagger';
import type { MedicalRecordsResponse } from '@/types';
import { medicalRecordsResponseSchema } from './medical-record.response';

const path = 'medical-records/my';

export class FindPatientMedicalRecordsResponse extends getBaseOkResponseSchema<MedicalRecordsResponse>({
  path,
  response: {
    message: 'Patient medical records retrieved successfully.',
    data: medicalRecordsResponseSchema,
  },
}) {}
