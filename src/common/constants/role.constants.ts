export const ROLES = {
  OWNER: 'owner',
  SELF: 'self',
  USER_MANAGER: 'user-manager',
  DOCTOR_MANAGER: 'doctor-manager',
  CLINIC_MANAGER: 'clinic-manager',
} as const;

export type RolesType = (typeof ROLES)[keyof typeof ROLES];
