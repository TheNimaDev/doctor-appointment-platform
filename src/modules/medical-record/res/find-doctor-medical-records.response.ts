import { getBaseOkResponseSchema } from '@/common/swagger';
import type { MedicalRecordsResponse } from '@/types';
import { medicalRecordsResponseSchema } from './medical-record.response';

const path = 'medical-records/doctor';

export class FindDoctorMedicalRecordsResponse extends getBaseOkResponseSchema<MedicalRecordsResponse>({
  path,
  response: {
    message: 'Doctor medical records retrieved successfully.',
    data: medicalRecordsResponseSchema,
  },
}) {}
