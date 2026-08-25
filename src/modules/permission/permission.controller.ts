import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiResponse, PermissionResponse, PermissionsResponse } from '@/types';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import * as PermissionDecorator from './decorators';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Create a new permission profile.
   */
  @Post()
  @PermissionDecorator.CreatePermissionDecorators()
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<ApiResponse<PermissionResponse>> {
    const data = await this.permissionService.createPermission({
      ...createPermissionDto,
    });

    return {
      message: 'Permission created successfully.',
      data,
    };
  }

  /**
   * Get all permissions.
   */
  @Get()
  @PermissionDecorator.FindPermissionsDecorators()
  async findAll(): Promise<ApiResponse<PermissionsResponse>> {
    const data = await this.permissionService.findAll({});

    return {
      message: 'Permissions retrieved successfully.',
      data,
    };
  }

  /**
   * Get a permission by ID.
   */
  @Get(':id')
  @PermissionDecorator.FindPermissionDecorators()
  async findById(@Param('id') id: string): Promise<ApiResponse<PermissionResponse>> {
    const data = await this.permissionService.getById({
      id,
    });

    return {
      message: 'Permission retrieved successfully.',
      data,
    };
  }

  /**
   * Update a permission profile.
   */
  @Patch(':id')
  @PermissionDecorator.UpdatePermissionDecorators()
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<ApiResponse<PermissionResponse>> {
    const data = await this.permissionService.updatePermission({
      id,
      ...updatePermissionDto,
    });

    return {
      message: 'Permission updated successfully.',
      data,
    };
  }

  /**
   * Soft-delete a permission profile.
   */
  @Delete(':id')
  @PermissionDecorator.DeletePermissionDecorators()
  async delete(@Param('id') id: string): Promise<ApiResponse> {
    await this.permissionService.deletePermission({
      id,
    });

    return {
      message: 'Permission deleted successfully.',
    };
  }
}
