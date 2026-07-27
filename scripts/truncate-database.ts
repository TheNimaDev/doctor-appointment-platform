import { AppDataSource } from '../db/data-source';

async function main(): Promise<void> {
  try {
    console.log('🔄 Connecting database...');

    const env = process.env.NODE_ENV || 'development';
    console.log(process.env);
    

    if (env === 'production') {
      console.error('❌ Cannot run in production!');
      process.exit(1);
    }

    await AppDataSource.initialize();

    console.log('\n✅ Database connected successfully!');

    const tables = await AppDataSource.query(`
      SELECT table_name AS name
      FROM information_schema.tables
      WHERE table_schema = DATABASE();
    `);

    await AppDataSource.query(`
      SET FOREIGN_KEY_CHECKS = 0;
    `);

    for (const table of tables) {
      await AppDataSource.query(`TRUNCATE TABLE \`${table.name}\`;`);
    }

    console.log('\n✅ Database truncated successfully!');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);

    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.query(`
          SET FOREIGN_KEY_CHECKS = 1;
        `);

      await AppDataSource.destroy();
    }
  }
}

main().catch(console.error);
