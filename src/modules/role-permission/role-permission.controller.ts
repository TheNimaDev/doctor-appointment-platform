import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { AddRolePermissionDto } from './dto';
import { ApiResponse, RolePermissionResponse, RolePermissionsResponse } from '@/types';
import * as RolePermissionDecorator from './decorators';

@Controller('roles/:roleId/permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  /**
   * Add a permission to a role.
   */
  @Post()
  @RolePermissionDecorator.AddRolePermissionDecorators()
  async add(
    @Param('roleId') roleId: string,
    @Body() addRolePermissionDto: AddRolePermissionDto,
  ): Promise<ApiResponse<RolePermissionResponse>> {
    const data = await this.rolePermissionService.add({
      roleId,
      permissionId: addRolePermissionDto.permissionId,
    });

    return {
      message: 'Permission assigned to role successfully.',
      data,
    };
  }

  /**
   * Remove a permission from a role.
   */
  @Delete(':permissionId')
  @RolePermissionDecorator.RemoveRolePermissionDecorators()
  async remove(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string): Promise<ApiResponse> {
    await this.rolePermissionService.remove({
      roleId,
      permissionId,
    });

    return {
      message: 'Permission removed from role successfully.',
    };
  }

  /**
   * Get all permissions assigned to a role.
   */
  @Get()
  @RolePermissionDecorator.FindRolePermissionsDecorators()
  async findAll(@Param('roleId') roleId: string): Promise<ApiResponse<RolePermissionsResponse>> {
    const data = await this.rolePermissionService.findAll({
      roleId,
    });

    return {
      message: 'Role permissions retrieved successfully.',
      data,
    };
  }
}
