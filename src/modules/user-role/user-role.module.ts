import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { RoleModule } from '@/modules/role';
import { UserModule } from '@/modules/user';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), RoleModule, UserModule],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
