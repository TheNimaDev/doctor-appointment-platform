import type { UserResponse } from '@/types';
import { UserStatus } from '@/modules/user/enums';
import { PERMISSIONS } from '@/common';

/** User schema example. */
export const userResponseSchema: UserResponse = {
  user: {
    id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
    firstName: 'Nima',
    lastName: 'Developer',
    email: 'Nima.Developer@example.com',
    avatarId: null,
    status: UserStatus.ACTIVE,
    roles: ['patient'],
    permissions: [
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.DOCTOR_READ,
      PERMISSIONS.CLINIC_READ,
      PERMISSIONS.SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SCHEDULE_READ,
      PERMISSIONS.TIME_SLOT_READ,
      PERMISSIONS.APPOINTMENT_READ_PATIENT,
      PERMISSIONS.APPOINTMENT_RESERVE,
      PERMISSIONS.APPOINTMENT_CANCEL,
      PERMISSIONS.DOCTOR_CLINIC_READ,
    ],
    lastLoginAt: new Date('2026-02-08T02:11:20.630Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-02-08T02:11:20.630Z'),
    deletedAt: null,
  },
};
