import type { AppointmentResponse, AppointmentsResponse } from '@/types';
import { AppointmentStatus } from '../enums';

const appointmentExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  patientId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  timeSlotId: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
  status: AppointmentStatus.PENDING,
  notes: 'First consultation.',
  expiresAt: new Date('2026-01-01T00:10:00.000Z'),
  cancelledAt: null,
  cancellationReason: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

export const appointmentResponseSchema: AppointmentResponse = {
  appointment: appointmentExample,
};

export const appointmentsResponseSchema: AppointmentsResponse = {
  appointments: [appointmentExample],
};
