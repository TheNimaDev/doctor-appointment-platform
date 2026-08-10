import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { AccessRequest, ApiResponse, UserResponse } from '@/types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   *  Get current user profile.
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: AccessRequest): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.getById({
      id: req.user.userId,
    });

    return {
      message: 'User retrieved successfully.',
      data: user,
    };
  }
}
