import type { UserRoleResponse, UserRolesResponse } from '@/types';

const userRoleExample = {
  id: '7f8c4f2e-9f6c-4f2d-8d13-2a4f8c9b7e61',
  userId: '2b4d7e9a-1c3f-4b5d-8e7f-9a1b2c3d4e5f',
  roleId: '4c6e8f1a-3d5b-4f7c-9a2e-1b3d5f7c9e0a',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-02-08T02:11:20.630Z'),
  deletedAt: null,
};

/** Swagger example for a user-role response. */
export const userRoleResponseSchema: UserRoleResponse = {
  userRole: userRoleExample,
};

/** Swagger example for a user-roles response. */
export const userRolesResponseSchema: UserRolesResponse = {
  userRoles: [userRoleExample],
};
