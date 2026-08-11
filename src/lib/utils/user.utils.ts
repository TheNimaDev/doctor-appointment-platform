import { RolesAndPermissions, UserResponse, UserRoleIncludeType } from "@/types";

/**
 * Extract roles and permissions from user relations.
 */
export function getRolesAndPermissions(user: UserRoleIncludeType): RolesAndPermissions {
  const roles = user.userRoles.map((userRole) => userRole.role.name);

  const permissions = [
    ...new Set(
      user.userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.name),
      ),
    ),
  ];

  return {
    roles,
    permissions,
  };
}

/**
 * Get safe user data for API response.
 */
export function getSafeUser(user: UserRoleIncludeType): UserResponse {
  const { roles, permissions } = getRolesAndPermissions(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      avatarId: user.avatarId,
      roles,
      permissions,
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    },
  };
}
