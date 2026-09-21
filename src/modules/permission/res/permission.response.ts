import type { PermissionResponse, PermissionsResponse } from '@/types';

const permissionExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  name: 'user:read',
  module: 'user',
  action: 'read',
  description: 'Read user profiles.',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

/** Swagger example for a permission response. */
export const permissionResponseSchema: PermissionResponse = {
  permission: permissionExample,
};

/** Swagger example for a permissions response. */
export const permissionsResponseSchema: PermissionsResponse = {
  permissions: [permissionExample],
};
