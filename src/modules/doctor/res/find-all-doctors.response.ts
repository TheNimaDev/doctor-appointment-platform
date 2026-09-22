import { getBaseOkResponseSchema, getValidationErrorResponse } from '@/common/swagger';
import type { DoctorsResponse } from '@/types';
import { doctorsResponseSchema } from './doctor.response';

const path = 'doctors/all';

export class FindDoctorsWithAllStatusResponse extends getBaseOkResponseSchema<DoctorsResponse>({
  path,
  response: { message: 'Doctors retrieved successfully.', data: doctorsResponseSchema },
}) {}

export class FindDoctorsWithAllStatusBadRequestResponse extends getValidationErrorResponse({
  path,
  errors: [{ field: 'status', error: 'Status must be a valid Doctor status.' }],
}) {}
