import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'PERMISSIONS';

export interface PermissionsDecoratorParams {
  permissions: string[];
  requiredAll?: boolean;
}

export function Permissions({ permissions, requiredAll = false }: PermissionsDecoratorParams) {
  return SetMetadata(PERMISSIONS_KEY, {
    permissions,
    requiredAll,
  });
}
