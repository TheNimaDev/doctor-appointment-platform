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
    name: 'owner.all',
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

export const RAW_PERMISSIONS_OBJECT = {
  ...BASE_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...DOCTOR_PERMISSIONS,
  ...CLINIC_PERMISSIONS,
} as const satisfies PermissionStructure;

type ReturnPermissionObject = Readonly<{
  [K in keyof typeof RAW_PERMISSIONS_OBJECT]: (typeof RAW_PERMISSIONS_OBJECT)[K]['name'];
}>;

export const PERMISSIONS = Object.fromEntries(
  Object.entries(RAW_PERMISSIONS_OBJECT).map(([key, value]) => [key, value.name]),
) as ReturnPermissionObject satisfies ReturnPermissionObject;

export type PermissionsKeyType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
