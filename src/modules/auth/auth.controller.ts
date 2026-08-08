import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResendVerificationEmailDto, VerifyEmailDto } from './dto';
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
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async logoutAll(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response): Promise<ApiResponse> {
    res.clearCookie('refreshToken', this.getCookieOptions());
    await this.authService.logoutAll(req.refreshPayload);

    return {
      message: 'Logout from all devices successfully.',
    };
  }

  /**
   * Resend the email verification link for a pending user.
   */
  @Post('verify/email/resend')
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(@Body() resendVerificationEmailDto: ResendVerificationEmailDto): Promise<ApiResponse> {
    await this.authService.resendVerificationEmail(resendVerificationEmailDto);

    return {
      message: 'Verification email sent successfully.',
    };
  }

  /**
   * Refresh the user's access and refresh tokens.
   * - Validates the current refresh token using the refresh token guard.
   * - Rotates the refresh token and stores the new token in an HTTP-only cookie.
   * - Returns a new access token and user data.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const { refreshToken, ...data } = await this.authService.refresh(req.refreshPayload);

    res.cookie('refreshToken', refreshToken.token, this.getCookieOptions(refreshToken.maxAge));

    return {
      message: 'Token refreshed successfully.',
      data,
    };
  }
}
