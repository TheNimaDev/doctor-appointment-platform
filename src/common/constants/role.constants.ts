export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CLINIC_ADMIN: 'CLINIC_ADMIN',
  DOCTOR: 'DOCTOR',
  ASSISTANT: 'ASSISTANT',
  PATIENT: 'PATIENT',
} as const;

export type RolesType = (typeof ROLES)[keyof typeof ROLES];
