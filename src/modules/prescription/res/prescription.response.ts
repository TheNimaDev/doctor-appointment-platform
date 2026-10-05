import { PrescriptionResponse, PrescriptionsResponse } from '@/types';

const prescriptionItemExample = {
  id: '4c6e8f1a-4f7c-9a2e-3d5b-2a4f8c9b7e61',
  prescriptionId: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  medicineName: 'Amoxicillin 500mg',
  dosage: '500mg',
  usage: 'Take 1 capsule orally every 8 hours after meals.',
  duration: '7 days',
  quantity: 21,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

const prescriptionExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  appointmentId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  notes: 'Take medications as prescribed and follow the doctor instructions.',
  items: [prescriptionItemExample],
  pdfFileId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

export const prescriptionResponseSchema: PrescriptionResponse = {
  prescription: prescriptionExample,
};

export const prescriptionsResponseSchema: PrescriptionsResponse = {
  prescriptions: [prescriptionExample],
};
