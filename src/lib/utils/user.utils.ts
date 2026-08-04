import { SafeUser, UserResponse } from '@/types';

export function getSafeUser(user: SafeUser): UserResponse {
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      avatarId: user.avatarId,
      permissions: [],
      roles: [],
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    },
  };
}
