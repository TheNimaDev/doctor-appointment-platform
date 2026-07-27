import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CliModule } from '@/modules';
import { DatabaseService } from '@/modules/database/database.service';

async function main(): Promise<void> {
  let app: INestApplicationContext | null = null;
  try {
    console.log('🔄 Connecting database...');

    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
      console.error('❌ Cannot run in production!');
      process.exit(1);
    }

    app = await NestFactory.createApplicationContext(CliModule);

    const database = app.get(DatabaseService);
    if (!database.isConnected()) {
      throw new Error('Database connection failed');
    }

    console.log('\n✅ Database connected successfully!');

    const dataSource = database.connection;

    const tables = await dataSource.query(`
      SELECT table_name AS name
      FROM information_schema.tables
      WHERE table_schema = DATABASE();
    `);

    try {
      await dataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

      for (const table of tables) {
        await dataSource.query(`TRUNCATE TABLE \`${table.name}\`;`);
      }
    } finally {
      await dataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    }

    console.log('\n✅ Database truncated successfully!');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);

    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

main().catch(console.error);
