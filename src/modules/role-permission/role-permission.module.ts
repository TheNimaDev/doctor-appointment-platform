import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission]), RoleModule, PermissionModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
})
export class RolePermissionModule {}
