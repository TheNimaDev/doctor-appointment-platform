import type { PatientResponse, PatientsResponse } from '@/types';
import { BloodType, Gender } from '../enums';

const patientExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  userId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  nationalCode: '1234567890',
  birthDate: '2007-10-10',
  gender: Gender.MALE,
  bloodType: BloodType.A_POSITIVE,
  emergencyContactName: 'Nima',
  emergencyContactPhone: '09123456789',
  address: 'Tehran, Ekbatan',
  city: 'Tehran',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

export const patientResponseSchema: PatientResponse = {
  patient: patientExample,
};

export const patientsResponseSchema: PatientsResponse = {
  patients: [patientExample],
};
