import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import * as readline from 'node:readline/promises';
import * as path from 'node:path';

function isValidMigrationName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

async function getInput(rl: readline.Interface, question: string, defaultValue = ''): Promise<string> {
  const answer = (await rl.question(question)).trim();

  return answer || defaultValue;
}

function runCommand(args: string[]): void {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error('Migration generation failed.');
  }
}

async function main(): Promise<void> {
  console.log('=========================================');
  console.log('      TypeORM Migration Generator');
  console.log('=========================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const dataSourcePath = path.join(process.cwd(), 'db', 'data-source.ts');

    if (!existsSync(dataSourcePath)) {
      console.error('❌ db/data-source.ts not found!');
      console.log('Please create your datasource first.');

      process.exitCode = 1;
      return;
    }

    let migrationName = process.argv[2];

    if (!migrationName) {
      migrationName = await getInput(rl, '📝 Enter migration name (default = init): ', 'init');
    }

    if (!isValidMigrationName(migrationName)) {
      console.error('\n❌ Invalid migration name.');

      process.exitCode = 1;
      return;
    }

    console.log('\nMigration Details');
    console.log('-----------------');
    console.log(`Name: ${migrationName}`);
    console.log(`Path: db/migrations/${migrationName}`);

    const confirm = await getInput(rl, '\nContinue? (Y/n): ', 'Y');

    if (confirm.toLowerCase() === 'n') {
      console.log('\n❌ Cancelled.');
      return;
    }

    console.log('\n⏳ Generating migration...\n');

    runCommand([
      'run',
      'typeorm',
      '--',
      'migration:generate',
      `db/migrations/${migrationName}`,
      '-d',
      'db/data-source.ts',
    ]);

    console.log('\n✅ Migration generated successfully!');
    console.log(`📄 db/migrations/${migrationName}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ Error:', message);

    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main().catch(console.error);
