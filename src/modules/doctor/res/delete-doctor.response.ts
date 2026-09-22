import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'doctors';

export class DeleteDoctorResponse extends getBaseOkResponseSchema<void>({
  path,
  response: { message: 'Doctor deleted successfully.' },
}) {}

export class DeleteDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}
