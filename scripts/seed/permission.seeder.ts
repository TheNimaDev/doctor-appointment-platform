import { EntityManager } from 'typeorm';
import { Permission } from '@/modules/permission/entities';
import { RAW_PERMISSIONS_OBJECT } from '@/common';

export async function seedPermissions(manager: EntityManager): Promise<void> {
  const permissions = Object.values(RAW_PERMISSIONS_OBJECT);

  for (const permission of permissions) {
    await manager.upsert(
      Permission,
      {
        name: permission.name,
        module: permission.module,
        action: permission.action,
        description: `Allows "${permission.action}" action on "${permission.module}" resource.`,
      },
      ['name'],
    );
  }

  console.log(`✅ ${permissions.length} permissions seeded.`);
}
