import type { ClinicResponse, ClinicsResponse } from '@/types';
import { ClinicStatus } from '../enums';

const clinicExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  ownerId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  name: 'Nima Medical Clinic',
  address: '123 Main Street',
  city: 'Tehran',
  phone: '+982112345678',
  latitude: '35.68920000',
  longitude: '51.38900000',
  description: 'A modern medical clinic.',
  status: ClinicStatus.ACTIVE,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

export const clinicResponseSchema: ClinicResponse = {
  clinic: clinicExample,
};

export const clinicsResponseSchema: ClinicsResponse = {
  clinics: [clinicExample],
};
