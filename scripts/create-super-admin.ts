import 'dotenv/config';
import * as readline from 'node:readline/promises';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CliModule } from '@/modules/cli/cli.module';
import { DatabaseService } from '@/modules/database/database.service';
import { UserService } from '@/modules/user/user.service';
import { RoleService } from '@/modules/role/role.service';
import { UserRoleService } from '@/modules/user-role/user-role.service';
import { User } from '@/modules/user/entities';
import { UserStatus } from '@/modules/user/enums';
import { ROLES } from '@/common';
import { RegisterDto } from '@/modules/auth/dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

async function getInput(rl: readline.Interface, question: string, defaultValue = ''): Promise<string> {
  while (true) {
    const answer = (await rl.question(question)).trim();

    if (!answer && !defaultValue) {
      console.log('❌ This field is required.\n');
      continue;
    }

    return answer || defaultValue;
  }
}

async function validateInput(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<RegisterDto> {
  const dto = plainToInstance(RegisterDto, data);

  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) => Object.values(error.constraints ?? {}));
    throw new Error(messages.join(',\n          '));
  }

  return dto;
}

async function main(): Promise<void> {
  console.log('=========================================');
  console.log('        Create Super Admin');
  console.log('=========================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let app: INestApplicationContext | null = null;

  try {
    app = await NestFactory.createApplicationContext(CliModule);

    const databaseService = app.get(DatabaseService);
    const userService = app.get(UserService);
    const roleService = app.get(RoleService);
    const userRoleService = app.get(UserRoleService);

    const dataSource = databaseService.dataSource;

    const email = await getInput(rl, 'Email: ');
    const firstName = await getInput(rl, 'First name: ');
    const lastName = await getInput(rl, 'Last name: ');

    const password = await getInput(rl, 'Password: ');
    const confirmPassword = await getInput(rl, 'Confirm password: ');

    if (password !== confirmPassword) {
      console.error('\n❌ Passwords do not match.');
      process.exitCode = 1;
      return;
    }

    const userData = await validateInput({
      email,
      password,
      firstName,
      lastName,
    });

    console.log('\nSuper Admin Data');
    console.log('----------------------');
    console.log(`Email     : ${userData.email}`);
    console.log(`First Name: ${userData.firstName}`);
    console.log(`Last Name : ${userData.lastName}`);
    console.log(`Role      : ${ROLES.SUPER_ADMIN}`);

    const confirm = await getInput(rl, '\nContinue? (Y/n): (default = Y) ', 'Y');

    if (confirm.toLowerCase() === 'n') {
      console.log('\n❌ Cancelled.');
      return;
    }

    await dataSource.transaction(async (manager: EntityManager) => {
      const existingUser = await manager.findOne(User, {
        where: {
          email: userData.email,
        },
      });

      if (existingUser) {
        throw new Error(`A user with email "${userData.email}" already exists.`);
      }

      const { role } = await roleService.findByName({
        name: ROLES.SUPER_ADMIN,
        manager,
      });

      const { user } = await userService.createUser({
        ...userData,
        status: UserStatus.ACTIVE,
        manager,
      });

      await userRoleService.assignSuperAdmin({
        userId: user.id,
        roleId: role.id,
        manager,
      });

      console.log('\n✅ Super admin created successfully.');
      console.log(`Email : ${user.email}`);
      console.log(`ID    : ${user.id}`);
      console.log(`Role  : ${role.name}`);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error('\n❌ Failed to create super admin.');
    console.error(`\n❌ Error: ${message}`);

    process.exitCode = 1;
  } finally {
    if (app) {
      await app.close();
    }
    rl.close();
  }
}

main().catch(console.error);
