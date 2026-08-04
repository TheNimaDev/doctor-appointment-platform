import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyEmailDto } from './dto';
import { ApiResponse, LoginResponse } from '@/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    await this.authService.register(registerDto);

    return {
      message: 'Registration successful. Please verify your email.',
    };
  }

  @Get('verify/email')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    await this.authService.verifyEmail(verifyEmailDto);

    return {
      message: 'Email verified successfully.',
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    const { refreshToken, ...data } = await this.authService.login(loginDto);

    return {
      message: 'Registration successful. Please verify your email.',
      data,
    };
  }
}
