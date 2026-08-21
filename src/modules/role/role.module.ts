import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, RolePermission, UserRole } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, RolePermission])],
})
export class RoleModule {}
