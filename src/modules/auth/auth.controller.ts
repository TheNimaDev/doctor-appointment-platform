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

  /**
   * Build secure cookie options for the refresh token.
   * - Enables strict security settings in production.
   */
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

  /**
   * Register a new user account.
   * - Sends an email verification request after successful registration.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    await this.authService.register(registerDto);

    return {
      message: 'Registration successful. Please verify your email.',
    };
  }

  /**
   * Verify a user's email address using the provided verification token.
   */
  @Get('verify/email')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<ApiResponse> {
    await this.authService.verifyEmail(verifyEmailDto);

    return {
      message: 'Email verified successfully.',
    };
  }

  /**
   * Authenticate a user and issue access and refresh tokens.
   * - Stores the refresh token in an HTTP-only cookie.
   */
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

  /**
   * Log out the current session and revoke its refresh token.
   */
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  async logout(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response): Promise<ApiResponse> {
    res.clearCookie('refreshToken', this.getCookieOptions());
    await this.authService.logout(req.refreshPayload);

    return {
      message: 'Logout successfully.',
    };
  }

  /**
   * Log out the user from all active sessions and revoke all refresh tokens.
   */
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
