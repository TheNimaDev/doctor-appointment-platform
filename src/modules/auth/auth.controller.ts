import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { ApiResponse, LoginResponse } from '@/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse<LoginResponse>> {
    return {
      message: 'User registered successfully',
      data: await this.authService.register(registerDto),
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    return {
      message: 'User logged in successfully',
      data: await this.authService.login(loginDto),
    };
  }
}
