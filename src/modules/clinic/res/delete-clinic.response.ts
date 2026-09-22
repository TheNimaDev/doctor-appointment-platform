import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'clinics/:id';

export class DeleteClinicResponse extends getBaseOkResponseSchema<void>({
  path,
  response: { message: 'Clinic deleted successfully.' },
}) {}

export class DeleteClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
  path,
  statusCode: 404,
}) {}
