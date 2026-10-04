import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
const path = 'prescriptions/:id';

export class DeletePrescriptionResponse extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'Prescription deleted successfully.',
  },
}) {}

export class DeletePrescriptionNotFoundResponse extends getNormalErrorResponse({
  path,
  statusCode: 404,
  message: 'Prescription not found in database.',
  error: 'Prescription Not Found',
}) {}
