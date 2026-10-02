import { SetMetadata } from '@nestjs/common';
import { PermissionsKeyType } from '@/common';

export const PERMISSION_METADATA = 'PERMISSIONS_METADATA' as const;

export interface PermissionDecoratorParams {
  permissions: PermissionsKeyType[];
  requiredAll?: boolean;

  ownership?: 'owner' | 'clinic' | 'doctor' | 'patient';

  resource?: string;
  resourceIdParam?: string;
}

export function Permission({
  permissions,
  requiredAll = false,
  ownership,
  resource,
  resourceIdParam = 'id',
}: PermissionDecoratorParams) {
  return SetMetadata(PERMISSION_METADATA, {
    permissions,
    requiredAll,
    ownership,
    resource,
    resourceIdParam,
  });
}
