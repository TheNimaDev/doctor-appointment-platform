import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { CliModule } from '@/modules/cli/cli.module';
import { DatabaseService } from '@/modules/database/database.service';

import { Permission } from '@/modules/permission/entities';
import { Role } from '@/modules/role/entities';
import { RolePermission } from '@/modules/role-permission/entities';

import {
  CLINIC_PERMISSIONS,
  DOCTOR_PERMISSIONS,
  DOCTOR_SCHEDULE_PERMISSIONS,
  DOCTOR_SPECIALTY_PERMISSIONS,
  RAW_PERMISSIONS_OBJECT,
  PERMISSIONS,
  ROLES,
} from '@/common';

interface SeedRoleParams {
  role: string;
  description: string;
  permissions: string[];
}

async function seedPermissions(manager: EntityManager): Promise<void> {
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

async function seedRole(manager: EntityManager, data: SeedRoleParams): Promise<void> {
  const { role, description, permissions } = data;

  let roleEntity = await manager.findOne(Role, {
    where: { name: role },
  });

  if (!roleEntity) {
    roleEntity = manager.create(Role, {
      name: role,
      description,
    });
  } else {
    roleEntity.description = description;
  }

  roleEntity = await manager.save(Role, roleEntity);

  for (const permissionName of permissions) {
    const permission = await manager.findOne(Permission, {
      where: {
        name: permissionName,
      },
    });

    if (!permission) {
      throw new Error(`Permission "${permissionName}" not found while seeding role "${role}".`);
    }

    const exists = await manager.findOne(RolePermission, {
      where: {
        roleId: roleEntity.id,
        permissionId: permission.id,
      },
    });

    if (exists) {
      continue;
    }

    const rolePermission = manager.create(RolePermission, {
      roleId: roleEntity.id,
      permissionId: permission.id,
    });

    await manager.save(RolePermission, rolePermission);
  }

  console.log(`✅ Role "${role}" seeded.`);
}

async function seedRoles(manager: EntityManager): Promise<void> {
  await seedRole(manager, {
    role: ROLES.SUPER_ADMIN,
    description: 'System administrator with full access to all resources.',
    permissions: [PERMISSIONS.OWNER_ALL],
  });

  await seedRole(manager, {
    role: ROLES.CLINIC_ADMIN,
    description: 'Administrator responsible for managing assigned clinics and related medical resources.',
    permissions: [
      PERMISSIONS.SPECIALTY_READ,

      ...Object.values(DOCTOR_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(CLINIC_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(DOCTOR_SPECIALTY_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(DOCTOR_SCHEDULE_PERMISSIONS).map((permission) => permission.name),
    ],
  });

  await seedRole(manager, {
    role: ROLES.DOCTOR,
    description: 'Doctor with access to manage personal medical resources and schedules.',
    permissions: [
      PERMISSIONS.DOCTOR_READ,
      PERMISSIONS.DOCTOR_UPDATE,

      PERMISSIONS.CLINIC_CREATE,
      PERMISSIONS.CLINIC_READ,
      PERMISSIONS.CLINIC_UPDATE,
      PERMISSIONS.CLINIC_DELETE,
      PERMISSIONS.CLINIC_UPDATE_STATUS,

      PERMISSIONS.SPECIALTY_READ,

      PERMISSIONS.DOCTOR_SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SPECIALTY_CREATE,
      PERMISSIONS.DOCTOR_SPECIALTY_UPDATE,
      PERMISSIONS.DOCTOR_SPECIALTY_DELETE,

      PERMISSIONS.DOCTOR_SCHEDULE_CREATE,
      PERMISSIONS.DOCTOR_SCHEDULE_READ,
      PERMISSIONS.DOCTOR_SCHEDULE_UPDATE,
      PERMISSIONS.DOCTOR_SCHEDULE_DELETE,
      PERMISSIONS.DOCTOR_SCHEDULE_UPDATE_STATUS,
    ],
  });

  await seedRole(manager, {
    role: ROLES.ASSISTANT,
    description: 'Assistant with limited access to assigned clinic resources.',
    permissions: [
      PERMISSIONS.DOCTOR_READ,
      PERMISSIONS.CLINIC_READ,
      PERMISSIONS.SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SCHEDULE_READ,
    ],
  });

  await seedRole(manager, {
    role: ROLES.PATIENT,
    description: 'Patient with access to personal profile and public medical resources.',
    permissions: [
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,

      PERMISSIONS.DOCTOR_READ,
      PERMISSIONS.CLINIC_READ,
      PERMISSIONS.SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SCHEDULE_READ,
    ],
  });
}

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const databaseService = app.get(DatabaseService);
  const dataSource = databaseService.dataSource;

  try {
    await dataSource.transaction(async (manager) => {
      console.log('=========================================');
      console.log('        Permission & Role Seeder');
      console.log('=========================================\n');

      console.log('🌱 Starting permission seed...\n');

      await seedPermissions(manager);
      await seedRoles(manager);

      console.log('\n=========================================');
      console.log('✅ Seed completed successfully.');
      console.log('=========================================');
    });
  } catch (error: unknown) {
    console.error('\n❌ Permission seed failed.');

    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);

    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap().catch(console.error);
