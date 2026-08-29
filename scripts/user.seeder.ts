import { EntityManager } from 'typeorm';
import { User } from '@/modules/user/entities';
import { UserService } from '@/modules/user/user.service';
import { ROLES } from '@/common';
import { UserRoleService } from '@/modules/user-role/user-role.service';
import { RoleService } from '@/modules/role/role.service';

const SEED_USERS = [
  {
    email: 'superadmin@example.com',
    password: '123456',
    firstName: 'Super',
    lastName: 'Admin',
    role: ROLES.SUPER_ADMIN,
  },
  {
    email: 'doctor@example.com',
    password: '123456',
    firstName: 'Nima',
    lastName: 'Doctor',
    role: ROLES.DOCTOR,
  },
  {
    email: 'clinicadmin@example.com',
    password: '123456',
    firstName: 'Clinic',
    lastName: 'Admin',
    role: ROLES.CLINIC_ADMIN,
  },
  {
    email: 'assistant@example.com',
    password: '123456',
    firstName: 'Clinic',
    lastName: 'Assistant',
    role: ROLES.ASSISTANT,
  },
  {
    email: 'patient@example.com',
    password: '123456',
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
    });

    const { role } = await roleService.findByName({
      name: userRole,
      manager,
    });

    await userRoleService.add({
      userId: user.id,
      roleId: role.id,
      manager,
    });
  }

  console.log(`✅ ${SEED_USERS.length} users seeded.`);
}
