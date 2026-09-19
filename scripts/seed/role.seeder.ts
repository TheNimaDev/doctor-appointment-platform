import { EntityManager, In } from 'typeorm';
import { Permission } from '@/modules/permission/entities';
import { Role } from '@/modules/role/entities';
import { RolePermission } from '@/modules/role-permission/entities';

import {
  CLINIC_PERMISSIONS,
  DOCTOR_CLINIC_PERMISSIONS,
  DOCTOR_PERMISSIONS,
  DOCTOR_SCHEDULE_PERMISSIONS,
  DOCTOR_SPECIALTY_PERMISSIONS,
  PERMISSIONS,
  ROLES,
  TIME_SLOT_PERMISSIONS,
  USER_PERMISSIONS,
} from '@/common';

interface SeedRoleParams {
  role: string;
  description: string;
  permissions: string[];
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

  const uniquePermissionNames = [...new Set(permissions)];
  const permissionEntities = await manager.find(Permission, {
    where: {
      name: In(uniquePermissionNames),
    },
  });

  const foundPermissionNames = new Set(permissionEntities.map((permission) => permission.name));
  const missingPermissionsNames = uniquePermissionNames.filter(
    (permissionName) => !foundPermissionNames.has(permissionName),
  );

  if (missingPermissionsNames.length > 0) {
    throw new Error(`Permissions not found while seeding role "${role}": ${missingPermissionsNames.join(', ')}`);
  }

  const desiredPermissionIds = new Set(permissionEntities.map((permission) => permission.id));
  const currentRolePermissions = await manager.find(RolePermission, {
    where: {
      roleId: roleEntity.id,
    },
  });

  const staleRolePermissions = currentRolePermissions.filter(
    (rolePermission) => !desiredPermissionIds.has(rolePermission.permissionId),
  );

  if (staleRolePermissions.length > 0) {
    await manager.remove(RolePermission, staleRolePermissions);
  }

  const existingPermissionIds = new Set(
    currentRolePermissions
      .filter((rolePermission) => desiredPermissionIds.has(rolePermission.permissionId))
      .map((rolePermission) => rolePermission.permissionId),
  );

  const newRolePermissions = permissionEntities
    .filter((permission) => !existingPermissionIds.has(permission.id))
    .map((permission) =>
      manager.create(RolePermission, {
        roleId: roleEntity.id,
        permissionId: permission.id,
      }),
    );

  if (newRolePermissions.length > 0) {
    await manager.save(RolePermission, newRolePermissions);
  }

  console.log(`✅ Role "${role}" synchronized (${uniquePermissionNames.length} permissions).`);
}

export async function seedRoles(manager: EntityManager): Promise<void> {
  await seedRole(manager, {
    role: ROLES.SUPER_ADMIN,
    description: 'System administrator with full access to all resources.',
    permissions: [PERMISSIONS.OWNER_ALL],
  });

  await seedRole(manager, {
    role: ROLES.CLINIC_ADMIN,
    description: 'Administrator responsible for managing assigned clinics and related medical resources.',
    permissions: [
      ...Object.values(CLINIC_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(DOCTOR_CLINIC_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(DOCTOR_SCHEDULE_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(TIME_SLOT_PERMISSIONS).map((permission) => permission.name),

      PERMISSIONS.APPOINTMENT_READ_DOCTOR,
      PERMISSIONS.APPOINTMENT_CONFIRM,
      PERMISSIONS.APPOINTMENT_REJECT,
      PERMISSIONS.APPOINTMENT_COMPLETE,
      PERMISSIONS.APPOINTMENT_NO_SHOW,
    ],
  });

  await seedRole(manager, {
    role: ROLES.DOCTOR,
    description: 'Doctor with access to manage personal medical resources and schedules.',
    permissions: [
      ...Object.values(DOCTOR_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(CLINIC_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(DOCTOR_SCHEDULE_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(TIME_SLOT_PERMISSIONS).map((permission) => permission.name),
      ...Object.values(DOCTOR_SPECIALTY_PERMISSIONS).map((permission) => permission.name),

      PERMISSIONS.APPOINTMENT_READ_DOCTOR,
      PERMISSIONS.APPOINTMENT_CONFIRM,
      PERMISSIONS.APPOINTMENT_REJECT,
      PERMISSIONS.APPOINTMENT_COMPLETE,
      PERMISSIONS.APPOINTMENT_NO_SHOW,
    ],
  });

  await seedRole(manager, {
    role: ROLES.PATIENT,
    description: 'Patient with access to personal profile and public medical resources.',
    permissions: [
      ...Object.values(USER_PERMISSIONS).map((permission) => permission.name),
      PERMISSIONS.DOCTOR_READ,
      PERMISSIONS.CLINIC_READ,
      PERMISSIONS.SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SPECIALTY_READ,
      PERMISSIONS.DOCTOR_SCHEDULE_READ,
      PERMISSIONS.TIME_SLOT_READ,
      PERMISSIONS.APPOINTMENT_READ_PATIENT,
      PERMISSIONS.APPOINTMENT_RESERVE,
      PERMISSIONS.APPOINTMENT_CANCEL,
      PERMISSIONS.DOCTOR_CLINIC_READ,
    ],
  });
}
