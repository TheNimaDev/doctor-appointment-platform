import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { AddRolePermissionDto } from './dto';
import { ApiResponse, RolePermissionResponse, RolePermissionsResponse } from '@/types';

@Controller('roles/:roleId/permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  /**
   * Add a permission to a role.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
