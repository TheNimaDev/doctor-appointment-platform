export type PermissionStructure = Record<
  string,
  {
    name: string;
    module: string;
    action: string;
  }
>;

export const BASE_PERMISSIONS = {
  OWNER_ALL: {
    name: 'owner:all',
    module: 'owner',
    action: 'all',
  },
} as const satisfies PermissionStructure;

export const USER_PERMISSIONS = {
  USER_READ: {
    name: 'user:read',
    module: 'user',
    action: 'read',
  },
  USER_UPDATE: {
    name: 'user:update',
    module: 'user',
    action: 'update',
  },
  USER_DELETE: {
    name: 'user:delete',
    module: 'user',
    action: 'delete',
  },
} as const satisfies PermissionStructure;

export const DOCTOR_PERMISSIONS = {
  DOCTOR_CREATE: {
    name: 'doctor:create',
    module: 'doctor',
    action: 'create',
  },
  DOCTOR_READ: {
    name: 'doctor:read',
    module: 'doctor',
    action: 'read',
  },
  DOCTOR_UPDATE: {
    name: 'doctor:update',
    module: 'doctor',
    action: 'update',
  },
  DOCTOR_DELETE: {
    name: 'doctor:delete',
    module: 'doctor',
    action: 'delete',
  },
} as const satisfies PermissionStructure;

export const CLINIC_PERMISSIONS = {
  CLINIC_CREATE: {
    name: 'clinic:create',
    module: 'clinic',
    action: 'create',
  },
  CLINIC_READ: {
    name: 'clinic:read',
    module: 'clinic',
    action: 'read',
  },
  CLINIC_UPDATE: {
    name: 'clinic:update',
    module: 'clinic',
    action: 'update',
  },
  CLINIC_DELETE: {
    name: 'clinic:delete',
    module: 'clinic',
    action: 'delete',
  },
  CLINIC_UPDATE_STATUS: {
    name: 'clinic:update-status',
    module: 'clinic',
    action: 'update-status',
  },
} as const satisfies PermissionStructure;

export const SPECIALTY_PERMISSIONS = {
  SPECIALTY_CREATE: {
    name: 'specialty:create',
    module: 'specialty',
    action: 'create',
  },
  SPECIALTY_READ: {
    name: 'specialty:read',
    module: 'specialty',
    action: 'read',
  },
  SPECIALTY_UPDATE: {
    name: 'specialty:update',
    module: 'specialty',
    action: 'update',
  },
  SPECIALTY_DELETE: {
    name: 'specialty:delete',
    module: 'specialty',
    action: 'delete',
  },
} as const satisfies PermissionStructure;

export const DOCTOR_SPECIALTY_PERMISSIONS = {
  DOCTOR_SPECIALTY_READ: {
    name: 'doctor-specialty:read',
    module: 'doctor-specialty',
    action: 'read',
  },
  DOCTOR_SPECIALTY_CREATE: {
    name: 'doctor-specialty:create',
    module: 'doctor-specialty',
    action: 'create',
  },
  DOCTOR_SPECIALTY_UPDATE: {
    name: 'doctor-specialty:update',
    module: 'doctor-specialty',
    action: 'update',
  },
  DOCTOR_SPECIALTY_DELETE: {
    name: 'doctor-specialty:delete',
    module: 'doctor-specialty',
    action: 'delete',
  },
} as const satisfies PermissionStructure;

export const DOCTOR_SCHEDULE_PERMISSIONS = {
  DOCTOR_SCHEDULE_CREATE: {
    name: 'doctor-schedule:create',
    module: 'doctor-schedule',
    action: 'create',
  },
  DOCTOR_SCHEDULE_READ: {
    name: 'doctor-schedule:read',
    module: 'doctor-schedule',
    action: 'read',
  },
  DOCTOR_SCHEDULE_UPDATE: {
    name: 'doctor-schedule:update',
    module: 'doctor-schedule',
    action: 'update',
  },
  DOCTOR_SCHEDULE_DELETE: {
    name: 'doctor-schedule:delete',
    module: 'doctor-schedule',
    action: 'delete',
  },
  DOCTOR_SCHEDULE_UPDATE_STATUS: {
    name: 'doctor-schedule:update-status',
    module: 'doctor-schedule',
    action: 'update-status',
  },
} as const satisfies PermissionStructure;

export const TIME_SLOT_PERMISSIONS = {
  TIME_SLOT_READ: {
    name: 'time-slot:read',
    module: 'time-slot',
    action: 'read',
  },

  TIME_SLOT_MANAGE: {
    name: 'time-slot:manage',
    module: 'time-slot',
    action: 'manage',
  },

  TIME_SLOT_BLOCK: {
    name: 'time-slot:block',
    module: 'time-slot',
    action: 'block',
  },

  TIME_SLOT_UNBLOCK: {
    name: 'time-slot:unblock',
    module: 'time-slot',
    action: 'unblock',
  },
} as const satisfies PermissionStructure;

export const APPOINTMENT_PERMISSIONS = {
  APPOINTMENT_READ_ALL: {
    name: 'appointment:read-all',
    module: 'appointment',
    action: 'read',
  },

  APPOINTMENT_READ_PATIENT: {
    name: 'appointment:read-patient',
    module: 'appointment',
    action: 'read',
  },

  APPOINTMENT_READ_DOCTOR: {
    name: 'appointment:read-doctor',
    module: 'appointment',
    action: 'read',
  },

  APPOINTMENT_RESERVE: {
    name: 'appointment:reserve',
    module: 'appointment',
    action: 'reserve',
  },

  APPOINTMENT_CANCEL: {
    name: 'appointment:cancel',
    module: 'appointment',
    action: 'cancel',
  },

  APPOINTMENT_CONFIRM: {
    name: 'appointment:confirm',
    module: 'appointment',
    action: 'confirm',
  },

  APPOINTMENT_REJECT: {
    name: 'appointment:reject',
    module: 'appointment',
    action: 'reject',
  },

  APPOINTMENT_COMPLETE: {
    name: 'appointment:complete',
    module: 'appointment',
    action: 'complete',
  },

  APPOINTMENT_NO_SHOW: {
    name: 'appointment:no-show',
    module: 'appointment',
    action: 'no-show',
  },
} as const satisfies PermissionStructure;

export const RAW_PERMISSIONS_OBJECT = {
  ...BASE_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...DOCTOR_PERMISSIONS,
  ...CLINIC_PERMISSIONS,
  ...SPECIALTY_PERMISSIONS,
  ...DOCTOR_SPECIALTY_PERMISSIONS,
  ...DOCTOR_SCHEDULE_PERMISSIONS,
  ...TIME_SLOT_PERMISSIONS,
  ...APPOINTMENT_PERMISSIONS,
} as const satisfies PermissionStructure;

type ReturnPermissionObject = Readonly<{
  [K in keyof typeof RAW_PERMISSIONS_OBJECT]: (typeof RAW_PERMISSIONS_OBJECT)[K]['name'];
}>;

export const PERMISSIONS = Object.fromEntries(
  Object.entries(RAW_PERMISSIONS_OBJECT).map(([key, value]) => [key, value.name]),
) as ReturnPermissionObject satisfies ReturnPermissionObject;

export type PermissionsKeyType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
