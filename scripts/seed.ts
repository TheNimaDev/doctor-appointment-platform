import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CliModule } from '@/modules/cli/cli.module';
import { DatabaseService } from '@/modules/database/database.service';
import { seedRoles } from './role.seeder';
import { seedPermissions } from './permission.seeder';
import { UserService } from '@/modules/user/user.service';
import { seedUsers } from './user.seeder';
import { RoleService } from '@/modules/role/role.service';
import { UserRoleService } from '@/modules/user-role/user-role.service';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const databaseService = app.get(DatabaseService);
  const dataSource = databaseService.dataSource;

  const userService = app.get(UserService);
  const roleService = app.get(RoleService);
  const userRoleService = app.get(UserRoleService);

  try {
    await dataSource.transaction(async (manager) => {
      console.log('=========================================');
      console.log('              Database Seeder');
      console.log('=========================================\n');

      console.log('🌱 Starting seed...\n');

      await seedPermissions(manager);
      await seedRoles(manager);
      await seedUsers(userService, roleService, userRoleService, manager);

      console.log('\n=========================================');
      console.log('✅ Seed completed successfully.');
      console.log('=========================================');
    });
  } catch (error: unknown) {
    console.error('\n❌ Seed failed.');

    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);

    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap().catch(console.error);
