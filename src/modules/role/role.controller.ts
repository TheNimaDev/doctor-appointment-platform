import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

import type { ApiResponse, RoleResponse, RolesResponse } from '@/types';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create a new role.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ApiResponse<RolesResponse>> {
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
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<ApiResponse<RoleResponse>> {
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('id') id: string): Promise<void> {
    await this.roleService.deleteRole({
      id,
    });
  }
}
