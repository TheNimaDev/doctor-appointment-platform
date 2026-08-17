import { SetMetadata } from '@nestjs/common';
import { PermissionsKeyType } from '@/common';

export const PERMISSION_METADATA = 'PERMISSIONS_METADATA' as const;

export interface PermissionDecoratorParams {
  permissions: PermissionsKeyType[];
  requiredAll?: boolean;
  owner?: boolean;
  resource?: string;
}

export function Permission({ permissions, requiredAll = false, owner = false, resource }: PermissionDecoratorParams) {
  return SetMetadata(PERMISSION_METADATA, {
    permissions,
    requiredAll,
    owner,
    resource,
  });
}
