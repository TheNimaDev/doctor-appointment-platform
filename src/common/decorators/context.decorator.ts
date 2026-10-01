import { SetMetadata } from '@nestjs/common';

export const USER_CONTEXT_METADATA = 'USER_CONTEXT_METADATA' as const;
export const USER_CONTEXTS = ['admin', 'clinic', 'doctor', 'patient'] as const;

export type UserContextType = (typeof USER_CONTEXTS)[number];

export const Context = (context: UserContextType) => SetMetadata(USER_CONTEXT_METADATA, context);
