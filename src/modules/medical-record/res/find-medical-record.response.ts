import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { MedicalRecordResponse } from '@/types';
import { medicalRecordResponseSchema } from './medical-record.response';

const path = 'medical-records';

export class FindMedicalRecordResponse extends getBaseOkResponseSchema<MedicalRecordResponse>({
  path,
  response: {
    message: 'Medical record retrieved successfully.',
    data: medicalRecordResponseSchema,
  },
}) {}

export class FindMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found in database.',
  error: 'Medical Record Not Found',
}) {}
