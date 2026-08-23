import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, RolePermission, UserRole } from './entities';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, RolePermission])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
