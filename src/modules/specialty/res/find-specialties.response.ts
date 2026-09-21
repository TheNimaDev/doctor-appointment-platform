import { getBaseOkResponseSchema } from '@/common/swagger';
import type { SpecialtiesResponse } from '@/types';
import { specialtiesResponseSchema } from './specialty.response';

const path = 'specialties';

/** Swagger response schema for successfully retrieving all specialties. */
export class FindSpecialtiesResponse extends getBaseOkResponseSchema<SpecialtiesResponse>({
  path,
  response: {
    message: 'Specialties retrieved successfully.',
    data: specialtiesResponseSchema,
  },
}) {}
