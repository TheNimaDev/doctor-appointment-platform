import type { RoleResponse, RolesResponse } from '@/types';

const roleExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  name: 'admin',
  description: 'System administrator role.',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

/** Swagger example for a role response. */
export const roleResponseSchema: RoleResponse = {
  role: roleExample,
};

/** Swagger example for a roles response. */
export const rolesResponseSchema: RolesResponse = {
  roles: [roleExample],
};
