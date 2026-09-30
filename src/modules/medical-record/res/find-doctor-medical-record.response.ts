import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/doctor/:id';

export class FindDoctorMedicalRecordResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Doctor medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindDoctorMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found in database.',
  error: 'Medical Record Not Found',
}) {}
