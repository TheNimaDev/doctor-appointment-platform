import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyEmailDto } from './dto';
import { ApiResponse, LoginResponse } from '@/types';
import type { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  getCookieOptions(maxAge?: number): CookieOptions {
    const isProduction: boolean = this.configService.get<string>('NODE_ENV') === 'production';

    return {
      sameSite: isProduction ? 'strict' : 'lax',
      httpOnly: true,
      secure: isProduction,
      path: '/',
      maxAge,
    };
  }

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const { refreshToken, ...data } = await this.authService.login(loginDto);

    const expiresIn = loginDto.remember
      ? this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_REMEMBER_EXPIRES')
      : this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRES');

    const maxAge = ms(expiresIn);

    res.cookie('refreshToken', refreshToken, this.getCookieOptions(maxAge));

    return {
      message: 'Registration successful. Please verify your email.',
      data,
    };
  }
}
