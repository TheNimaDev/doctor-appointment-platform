import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/:id';

export class FindMyClinicMedicalRecordResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Clinic medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindMyClinicMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found in clinic.',
  error: 'Medical Record Not Found',
}) {}
