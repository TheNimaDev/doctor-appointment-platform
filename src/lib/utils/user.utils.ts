import { User } from '@/modules/user/entities';
import { AuthUserResponse } from '@/types';

export function getSafeUser(user: User): AuthUserResponse {
  const { password, ...safeUser } = user;

  return {
    user: { ...safeUser },
  };
}
