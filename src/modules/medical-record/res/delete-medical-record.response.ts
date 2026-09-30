import { getNormalErrorResponse } from '@/common/swagger';

const path = 'medical-records/:id';

export class DeleteMedicalRecordNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Medical record not found in database.',
  error: 'Medical Record Not Found',
}) {}
