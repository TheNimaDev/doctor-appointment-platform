import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/modules/database';
import { UserModule } from '@/modules/user';
import { RoleModule } from '@/modules/role';
import { UserRoleModule } from '@/modules/user-role';
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
