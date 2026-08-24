import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
})
export class RolePermissionModule {}
