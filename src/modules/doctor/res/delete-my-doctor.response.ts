import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';

const path = 'doctors';

export class DeleteMyDoctorResponse extends getBaseOkResponseSchema<void>({
  path,
  response: { message: 'Doctor deleted successfully.' },
}) {}

export class DeleteMyDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}
