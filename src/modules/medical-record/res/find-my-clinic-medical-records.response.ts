import { getBaseOkResponseSchema } from '@/common/swagger';
import type { MedicalRecordsResponse } from '@/types';
import { medicalRecordsResponseSchema } from './medical-record.response';

const path = 'medical-records/my-clinic';

export class FindMyClinicMedicalRecordsResponse extends getBaseOkResponseSchema<MedicalRecordsResponse>({
  path,
  response: {
    message: 'Clinic medical records retrieved successfully.',
    data: medicalRecordsResponseSchema,
  },
}) {}
