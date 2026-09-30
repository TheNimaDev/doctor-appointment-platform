import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records/my/:id';

export class FindPatientMedicalRecordResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Patient medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindPatientMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found in database.',
  error: 'Medical Record Not Found',
}) {}
