import type { DoctorResponse, DoctorsResponse } from '@/types';
import { DoctorStatus } from '../enums';

const doctorExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  userId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  medicalCode: 'MED-123456',
  bio: 'Experienced cardiologist.',
  experienceYears: 10,
  consultationFee: '50.00',
  ratingAverage: '4.80',
  reviewCount: 120,
  status: DoctorStatus.ACTIVE,
  doctorClinics: [],
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

export const doctorResponseSchema: DoctorResponse = {
  doctor: doctorExample,
};
export const doctorsResponseSchema: DoctorsResponse = {
  doctors: [doctorExample],
};
