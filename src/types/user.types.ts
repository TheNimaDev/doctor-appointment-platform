import { User } from '@/modules/user/entities';

/** User type without sensitive fields */
export type SafeUser = Omit<User, 'password'>;