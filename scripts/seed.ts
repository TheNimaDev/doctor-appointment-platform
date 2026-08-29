import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CliModule } from '@/modules/cli/cli.module';
import { DatabaseService } from '@/modules/database/database.service';
import { seedRoles } from './role.seeder';
import { seedPermissions } from './permission.seeder';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const databaseService = app.get(DatabaseService);
  const dataSource = databaseService.dataSource;

  try {
    await dataSource.transaction(async (manager) => {
      console.log('=========================================');
      console.log('        Permission & Role Seeder');
      console.log('=========================================\n');

      console.log('🌱 Starting seed...\n');

      await seedPermissions(manager);
      await seedRoles(manager);

      console.log('\n=========================================');
      console.log('✅ Seed completed successfully.');
      console.log('=========================================');
    });
  } catch (error: unknown) {
    console.error('\n❌ seed failed.');

    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);

    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap().catch(console.error);
