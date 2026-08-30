import { EntityManager } from 'typeorm';
import { User } from '@/modules/user/entities';
import { UserService } from '@/modules/user/user.service';
import { ROLES } from '@/common';
import { UserRoleService } from '@/modules/user-role/user-role.service';
import { RoleService } from '@/modules/role/role.service';
import { UserStatus } from '@/modules/user/enums';
import { Role } from '@/modules/role/entities';

const SEED_USERS = [
  {
    email: 'superadmin@example.com',
    password: '12345678',
    firstName: 'Super',
    lastName: 'Admin',
    role: ROLES.SUPER_ADMIN,
  },
  {
    email: 'doctor@example.com',
    password: '12345678',
    firstName: 'Nima',
    lastName: 'Doctor',
    role: ROLES.DOCTOR,
  },
  {
    email: 'clinicadmin@example.com',
    password: '12345678',
    firstName: 'Clinic',
    lastName: 'Admin',
    role: ROLES.CLINIC_ADMIN,
  },
  {
    email: 'assistant@example.com',
    password: '12345678',
    firstName: 'Clinic',
    lastName: 'Assistant',
    role: ROLES.ASSISTANT,
  },
  {
    email: 'patient@example.com',
    password: '12345678',
    firstName: 'Nima',
    lastName: 'Patient',
    role: ROLES.PATIENT,
  },
] as const;

export async function seedUsers(
  userService: UserService,
  roleService: RoleService,
  userRoleService: UserRoleService,
  manager: EntityManager,
): Promise<void> {
  const patientRole = await manager.findOne(Role, {
    where: {
      name: ROLES.PATIENT,
    },
  });

  for (const userData of SEED_USERS) {
    const { role: userRole, ...userDate } = userData;

    const exists = await manager.findOne(User, {
      where: {
        email: userData.email,
      },
    });

    if (exists) {
      continue;
    }
    const { user } = await userService.createUser({
      ...userDate,
      manager,
      status: UserStatus.ACTIVE,
    });

    const { role } = await roleService.findByName({
      name: userRole,
      manager,
    });

    if (role.name !== ROLES.SUPER_ADMIN) {
      await userRoleService.add({
        userId: user.id,
        roleId: patientRole.id,
        manager,
      });
    }
    if (patientRole.id !== role.id) {
      await userRoleService.add({
        userId: user.id,
        roleId: role.id,
        manager,
      });
    }
  }

  console.log(`✅ ${SEED_USERS.length} users seeded.`);
}
