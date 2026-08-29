import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/modules/database';
import { UserModule } from '../user';
import { RoleModule } from '../role';
import { UserRoleModule } from '../user-role';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    RoleModule,
    UserRoleModule,
  ],
})
export class CliModule {}
