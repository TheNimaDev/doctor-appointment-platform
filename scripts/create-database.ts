import { createConnection, Connection } from 'mysql2/promise';
import * as readline from 'node:readline/promises';

async function getInput(rl: readline.Interface, question: string, defaultValue: string = ''): Promise<string> {
  const answer = (await rl.question(question)).trim();
  return answer || defaultValue;
}

async function getDbName(rl: readline.Interface, connection: Connection): Promise<string | null> {
  while (true) {
    const dbName = await getInput(
      rl,
      'Enter database name (default = doctor_appointment_platform): ',
      'doctor_appointment_platform',
    );

    const [rows] = await connection.query('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?', [
      dbName,
    ]);

    if (Array.isArray(rows) && rows.length > 0) {
      const answer = await getInput(rl, `Database ${dbName} already exists. Change database name? (y/N): `, 'N');

      if (answer.toLowerCase() === 'y') {
        continue;
      } else {
        return null;
      }
    }

    return dbName;
  }
}

async function createDatabase(connection: Connection, dbName: string): Promise<void> {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci`,
  );
  console.log('✅ Database created successfully!');
}

async function verifyDatabase(connection: Connection, dbName: string): Promise<void> {
  const [rows] = await connection.query(
    `SELECT DEFAULT_CHARACTER_SET_NAME,
     DEFAULT_COLLATION_NAME
     FROM INFORMATION_SCHEMA.SCHEMATA
     WHERE SCHEMA_NAME = ?`,
    [dbName],
  );

  if (Array.isArray(rows) && rows.length > 0) {
    const charset = (rows[0] as any).DEFAULT_CHARACTER_SET_NAME;
    const collation = (rows[0] as any).DEFAULT_COLLATION_NAME;
    console.log(`📊 Database charset: ${charset}, collation: ${collation}`);
  }
}

async function main() {
  console.log('=========================================');
  console.log('  MySQL Database Setup with UTF8 Support');
  console.log('=========================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const dbUser = await getInput(rl, 'Enter database username (default = root): ', 'root');
  const dbPass = await getInput(rl, 'Enter database password: ');

  try {
    const connection = await createConnection({
      host: 'localhost',
      user: dbUser,
      password: dbPass,
    });
    console.log('✅ Connected to MySQL server\n');

    const dbName = await getDbName(rl, connection);

    if (dbName === null) {
      console.log('❌ Cancelled.');
      process.exit(0);
    }

    await createDatabase(connection, dbName);

    await verifyDatabase(connection, dbName);

    console.log('\n=========================================');
    console.log('🎉 All done! Database is ready to use.');
    console.log('=========================================');

    await connection.end();
  } catch (error) {
    console.error('\n❌ Error:', (error as Error).message || 'Something went wrong');
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
