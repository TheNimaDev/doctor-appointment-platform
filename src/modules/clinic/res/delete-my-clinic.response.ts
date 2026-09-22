import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'clinics';

export class DeleteMyClinicResponse extends getBaseOkResponseSchema<void>({
  path,
  response: { message: 'Clinic deleted successfully.' },
}) {}

export class DeleteMyClinicNotFoundResponse extends getNormalErrorResponse({
  message: 'Clinic not found in database.',
  error: 'Clinic Not Found',
  path,
  statusCode: 404,
}) {}
