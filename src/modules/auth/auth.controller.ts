import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyEmailDto } from './dto';
import type { ApiResponse, LoginResponse, NormalizedClientInfo, RefreshRequest } from '@/types';
import type { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { NormalizeClientInfo } from '@/common';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

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
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<ApiResponse> {
    await this.authService.verifyEmail(verifyEmailDto);

    return {
      message: 'Email verified successfully.',
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const { refreshToken, ...data } = await this.authService.login({ ...loginDto, clientInfo });

    res.cookie('refreshToken', refreshToken.token, this.getCookieOptions(refreshToken.maxAge));

    return {
      message: 'Login successful.',
      data,
    };
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response): Promise<ApiResponse> {
    res.clearCookie('refreshToken', this.getCookieOptions());
    await this.authService.logout(req.refreshPayload);

    return {
      message: 'Logout successfully.',
    };
  }

  @Post('logout/all')
  @UseGuards(RefreshTokenGuard)
  async logoutAll(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response): Promise<ApiResponse> {
    res.clearCookie('refreshToken', this.getCookieOptions());
    await this.authService.logoutAll(req.refreshPayload);

    return {
      message: 'Logout from all devices successfully.',
    };
  }
}
