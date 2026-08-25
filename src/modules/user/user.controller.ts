import { Body, Controller, Delete, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { AccessRequest, ApiResponse, UserResponse } from '@/types';
import { DeleteMeDto, UpdateProfileDto } from './dto';
import * as UserDecorator from './decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the current user's profile.
   */
  @Get('me')
  @UserDecorator.GetMeDecorators()
  async getMe(@Req() req: AccessRequest): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.getById({
      id: req.user.userId,
    });

    return {
      message: 'User retrieved successfully.',
      data: user,
    };
  }

  /**
   * Update the current user's profile.
   */
  @Patch('me')
  @UserDecorator.UpdateMeDecorators()
  async updateMe(
    @Req() req: AccessRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.updateProfile({
      userId: req.user.userId,
      ...updateProfileDto,
    });

    return {
      message: 'Profile updated successfully.',
      data: user,
    };
  }

  /**
   * Soft-delete the current user's account.
   */
  @Delete('me')
  @UserDecorator.DeleteMeDecorators()
  async deleteMe(@Req() req: AccessRequest, @Body() deleteMeDto: DeleteMeDto): Promise<ApiResponse> {
    await this.userService.deleteUser({
      userId: req.user.userId,
      password: deleteMeDto.password,
    });

    return {
      message: 'Account deleted successfully.',
    };
  }
}
