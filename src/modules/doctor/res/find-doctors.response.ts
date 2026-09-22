import { getBaseOkResponseSchema } from '@/common/swagger';
import type { DoctorsResponse } from '@/types';
import { doctorsResponseSchema } from './doctor.response';

const path = 'doctors';

export class FindDoctorsResponse extends getBaseOkResponseSchema<DoctorsResponse>({
  path,
  response: { message: 'Doctors retrieved successfully.', data: doctorsResponseSchema },
}) {}
