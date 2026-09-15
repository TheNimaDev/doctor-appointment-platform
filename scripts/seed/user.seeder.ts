import { EntityManager } from 'typeorm';
import { User } from '@/modules/user/entities';
import { UserService } from '@/modules/user/user.service';
import { ROLES } from '@/common';
import { UserRoleService } from '@/modules/user-role/user-role.service';
import { RoleService } from '@/modules/role/role.service';
import { UserStatus } from '@/modules/user/enums';
import { ALL_SEED_USERS } from './seed-constants';

export async function seedUsers(
  userService: UserService,
  roleService: RoleService,
  userRoleService: UserRoleService,
  manager: EntityManager,
): Promise<void> {
  const { role: patientRole } = await roleService.findByName({
    name: ROLES.PATIENT,
    manager,
  });

  for (const seedUser of ALL_SEED_USERS) {
    const { role: userRole, ...userData } = seedUser;

    const exists = await manager.findOne(User, {
      where: {
        email: userData.email,
      },
    });

    if (exists) {
      continue;
    }

    const { user } = await userService.createUser({
      ...userData,
      status: UserStatus.ACTIVE,
      manager,
    });

    const { role } = await roleService.findByName({
      name: userRole,
      manager,
    });

    if (role.name === ROLES.SUPER_ADMIN) {
      await userRoleService.assignSuperAdmin({
        userId: user.id,
        roleId: role.id,
        manager,
      });

      continue;
    }

    await userRoleService.add({
      userId: user.id,
      roleId: patientRole.id,
      manager,
    });

    if (patientRole.id !== role.id) {
      await userRoleService.add({
        userId: user.id,
        roleId: role.id,
        manager,
      });
    }
  }

  console.log(`✅ ${ALL_SEED_USERS.length} users seeded.`);
}
