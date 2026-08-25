import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { AddUserRoleDto } from './dto';
import { ApiResponse, UserRoleResponse, UserRolesResponse } from '@/types';
import * as UserRoleDecorator from './decorators';

@Controller('users/:userId/roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * Get all roles assigned to a user.
   */
  @Get()
  @UserRoleDecorator.FindUserRolesDecorators()
  async findAll(@Param('userId') userId: string): Promise<ApiResponse<UserRolesResponse>> {
    const data = await this.userRoleService.findAll({
      userId,
    });

    return {
      message: 'User roles retrieved successfully.',
      data,
    };
  }

  /**
   * Add a role to a user.
   */
  @Post()
  @UserRoleDecorator.AddUserRoleDecorators()
  async add(
    @Param('userId') userId: string,
    @Body() addUserRoleDto: AddUserRoleDto,
  ): Promise<ApiResponse<UserRoleResponse>> {
    const data = await this.userRoleService.add({
      userId,
      roleId: addUserRoleDto.roleId,
    });

    return {
      message: 'Role assigned to user successfully.',
      data,
    };
  }

  /**
   * Remove a role from a user.
   */
  @Delete(':roleId')
  @UserRoleDecorator.RemoveUserRoleDecorators()
  async remove(@Param('userId') userId: string, @Param('roleId') roleId: string): Promise<ApiResponse> {
    await this.userRoleService.remove({
      userId,
      roleId,
    });

    return {
      message: 'Role removed from user successfully.',
    };
  }
}
