import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorResponse } from '@/types';
import { doctorResponseSchema } from './doctor.response';

const path = 'doctors/my';

export class FindMyDoctorResponse extends getBaseOkResponseSchema<DoctorResponse>({
  path,
  response: { message: 'Doctor profile retrieved successfully.', data: doctorResponseSchema },
}) {}

export class FindMyDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}
