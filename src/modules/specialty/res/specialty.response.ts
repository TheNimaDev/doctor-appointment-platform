import type { SpecialtiesResponse, SpecialtyResponse } from '@/types';
import { SpecialtyStatus } from '../enums';

const specialtyExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  name: 'Cardiology',
  slug: 'cardiology',
  description: 'Medical specialty focused on the heart and cardiovascular system.',
  icon: null,
  status: SpecialtyStatus.ACTIVE,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

/** Swagger example for a specialty response. */
export const specialtyResponseSchema: SpecialtyResponse = {
  specialty: specialtyExample,
};

/** Swagger example for specialties response. */
export const specialtiesResponseSchema: SpecialtiesResponse = {
  specialties: [specialtyExample],
};
