import { createConnection, Connection } from 'mysql2/promise';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const DB_HOST = process.env.DB_HOST ?? 'localhost';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USERNAME = process.env.DB_USERNAME ?? 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
const DEFAULT_DB_NAME = process.env.DB_NAME ?? 'doctor_appointment_platform';

function isValidDatabaseName(name: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(name);
}

async function getInput(rl: readline.Interface, question: string, defaultValue: string = ''): Promise<string> {
  const answer = (await rl.question(question)).trim();
  return answer || defaultValue;
}

async function getDbName(rl: readline.Interface, connection: Connection): Promise<string | null> {
  while (true) {
    const dbName = await getInput(rl, `Enter database name (default = ${DEFAULT_DB_NAME}): `, DEFAULT_DB_NAME);

    if (!isValidDatabaseName(dbName)) {
      console.log('\n❌ Invalid database name.');
      continue;
    }

    const [rows] = await connection.query('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?', [
      dbName,
    ]);

    if (Array.isArray(rows) && rows.length > 0) {
      const answer = await getInput(
        rl,
        `Database ${dbName} already exists. Change database name? (y/N) (default = N) : `,
        'N',
      );

      if (answer.toLowerCase() === 'y') {
        continue;
      }

      return null;
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
  console.log('\n✅ Database created successfully!');
}

async function getDbInfo(connection: Connection, dbName: string): Promise<void> {
  const [rows] = await connection.query(
    `SELECT DEFAULT_CHARACTER_SET_NAME,
     DEFAULT_COLLATION_NAME
     FROM INFORMATION_SCHEMA.SCHEMATA
     WHERE SCHEMA_NAME = ?`,
    [dbName],
  );

  if (Array.isArray(rows) && rows.length > 0) {
    const schema = rows[0] as {
      DEFAULT_CHARACTER_SET_NAME: string;
      DEFAULT_COLLATION_NAME: string;
    };

    console.log(`📊 Charset: ${schema.DEFAULT_CHARACTER_SET_NAME}`);
    console.log(`📊 Collation: ${schema.DEFAULT_COLLATION_NAME}`);
  }
}

async function main(): Promise<void> {
  console.log('=========================================');
  console.log('        MySQL Database Setup');
  console.log('=========================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let connection: Connection | null = null;

  try {
    connection = await createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USERNAME,
      password: DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL server\n');

    const dbName = await getDbName(rl, connection);

    if (!dbName) {
      console.log('\n❌ Cancelled.');
      return;
    }

    console.log('\nDatabase Configuration');
    console.log('----------------------');
    console.log(`Host     : ${DB_HOST}`);
    console.log(`Port     : ${DB_PORT}`);
    console.log(`Database : ${dbName}`);

    const confirm = await getInput(rl, '\nContinue? (Y/n): (default = Y) ', 'Y');

    if (confirm.toLowerCase() === 'n') {
      console.log('\n❌ Cancelled.');
      return;
    }

    await createDatabase(connection, dbName);
    await getDbInfo(connection, dbName);

    console.log('\n=========================================');
    console.log('🎉 All done! Database is ready to use.');
    console.log('=========================================');
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException & {
      code?: string;
    };
    switch (err.code) {
      case 'ECONNREFUSED':
        console.error('\n❌ Cannot connect to MySQL server.');
        console.error('Please make sure MySQL is running.');
        break;

      case 'ER_ACCESS_DENIED_ERROR':
        console.error('\n❌ Invalid database credentials.');
        break;

      default:
        console.error('\n❌', err.message);
    }

    process.exitCode = 1;
    return;
  } finally {
    if (connection) {
      await connection.end();
    }

    rl.close();
  }
}

main().catch(console.error);
