import { getBaseOkResponseSchema, getNormalErrorResponse } from '@/common/swagger';
import type { DoctorResponse } from '@/types';
import { doctorResponseSchema } from './doctor.response';

const path = 'doctors/:id';

export class FindDoctorResponse extends getBaseOkResponseSchema<DoctorResponse>({
  path,
  response: { message: 'Doctor retrieved successfully.', data: doctorResponseSchema },
}) {}

export class FindDoctorNotFoundResponse extends getNormalErrorResponse({
  message: 'Doctor not found in database.',
  error: 'Doctor Not Found',
  path,
  statusCode: 404,
}) {}
