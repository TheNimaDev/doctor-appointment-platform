import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CliModule } from '@/modules/cli/cli.module';
import { DatabaseService } from '@/modules/database/database.service';
import { UserService } from '@/modules/user/user.service';
import { RoleService } from '@/modules/role/role.service';
import { UserRoleService } from '@/modules/user-role/user-role.service';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { ClinicService } from '@/modules/clinic/clinic.service';
import { DoctorClinicService } from '@/modules/doctor-clinic/doctor-clinic.service';
import { seedRoles, seedPermissions, seedUsers, seedDoctors, seedClinics, seedDoctorClinics } from './seed/';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const databaseService = app.get(DatabaseService);
  const dataSource = databaseService.dataSource;

  const userService = app.get(UserService);
  const roleService = app.get(RoleService);
  const userRoleService = app.get(UserRoleService);
  const doctorService = app.get(DoctorService);
  const clinicService = app.get(ClinicService);
  const doctorClinicService = app.get(DoctorClinicService);

  try {
    await dataSource.transaction(async (manager) => {
      console.log('=========================================');
      console.log('              Database Seeder');
      console.log('=========================================\n');

      console.log('🌱 Starting seed...\n');

      const isDevelopment = process.env.NODE_ENV === 'development';

      await seedPermissions(manager);
      await seedRoles(manager);

      if (isDevelopment) {
        await seedUsers(userService, roleService, userRoleService, manager);
        await seedDoctors(doctorService, manager);
        await seedClinics(clinicService, manager);
        await seedDoctorClinics(doctorClinicService, manager);
      }

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
