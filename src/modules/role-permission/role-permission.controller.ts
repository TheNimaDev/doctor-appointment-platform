import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { AddRolePermissionDto } from './dto';

@Controller('roles/:roleId/permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  /**
   * Add a permission to a role.
   */
  @Post()
  async add(@Param('roleId') roleId: string, @Body() addRolePermissionDto: AddRolePermissionDto) {
    return this.rolePermissionService.add({
      roleId,
      permissionId: addRolePermissionDto.permissionId,
    });
  }

  /**
   * Remove a permission from a role.
   */
  @Delete(':permissionId')
  async remove(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string): Promise<void> {
    return this.rolePermissionService.remove({
      roleId,
      permissionId,
    });
  }

  /**
   * Get all permissions assigned to a role.
   */
  @Get()
  async findAll(@Param('roleId') roleId: string) {
    return this.rolePermissionService.findAll({
      roleId,
    });
  }
}
