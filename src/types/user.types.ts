import { User } from '@/modules/user/entities';

/** User type without sensitive fields */
export type SafeUser = Omit<User, 'password'>;

/** User data required for authentication */
export type AuthUser = Pick<User, 'id' | 'email' | 'password' | 'status'>;

/** Nullable auth user */
export type NullableAuthUser = AuthUser | null;

/** Nullable safe user result */
export type NullableSafeUser = SafeUser | null;