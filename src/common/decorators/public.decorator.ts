import { SetMetadata } from '@nestjs/common';

export interface PublicDecoratorParams {
  isPublicAccess?: boolean;
  isPublicPermission?: boolean;
}

export const IS_PUBLIC_KEY = 'IS_PUBLIC';

/**
 * Mark a route as public for access and permission guards.
 * - Allows configuring each guard independently.
 */
export function Public(params: PublicDecoratorParams = {}) {
  return SetMetadata(IS_PUBLIC_KEY, {
    isPublicAccess: params.isPublicAccess ?? true,
    isPublicPermission: params.isPublicPermission ?? true,
  });
}