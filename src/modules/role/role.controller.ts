import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import type { ApiResponse, RoleResponse, RolesResponse } from '@/types';
import * as RoleDecorator from './decorators';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create a new role.
   */
  @Post()
  @RoleDecorator.CreateRoleDecorators()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<ApiResponse<RoleResponse>> {
    const role = await this.roleService.createRole({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    return {
      message: 'Role created successfully.',
      data: role,
    };
  }

  /**
   * Get all roles.
   */
  @Get()
  @RoleDecorator.FindRolesDecorators()
  async getRoles(): Promise<ApiResponse<RolesResponse>> {
    const roles = await this.roleService.findAll({});

    return {
      message: 'Roles retrieved successfully.',
      data: roles,
    };
  }

  /**
   * Get a role by ID.
   */
  @Get(':id')
  @RoleDecorator.FindRoleDecorators()
  async getRoleById(@Param('id') id: string): Promise<ApiResponse<RoleResponse>> {
    const role = await this.roleService.getById({
      id,
    });

    return {
      message: 'Role retrieved successfully.',
      data: role,
    };
  }

  /**
   * Update a role.
   */
  @Patch(':id')
  @RoleDecorator.UpdateRoleDecorators()
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<ApiResponse<RoleResponse>> {
    const role = await this.roleService.updateRole({
      id,
      name: updateRoleDto.name,
      description: updateRoleDto.description,
    });

    return {
      message: 'Role updated successfully.',
      data: role,
    };
  }

  /**
   * Soft-delete a role.
   */
  @Delete(':id')
  @RoleDecorator.DeleteRoleDecorators()
  async deleteRole(@Param('id') id: string): Promise<ApiResponse> {
    await this.roleService.deleteRole({
      id,
    });

    return {
      message: 'Role deleted successfully.',
    };
  }
}
